import { NextRequest, NextResponse } from "next/server";

// Cloudflare Pages 需要边缘运行时
export const runtime = 'edge';

const DASHSCOPE_API_BASE = "https://dashscope.aliyuncs.com/api/v1";

/**
 * 上传图片到阿里云临时存储并获取内部 URL
 * @param imageBuffer 图片的 ArrayBuffer
 * @param contentType 图片 MIME 类型
 * @param apiKey 阿里云 API Key
 * @returns 阿里云内部 URL
 */
async function uploadImageToDashScope(
  imageBuffer: ArrayBuffer,
  contentType: string,
  apiKey: string
): Promise<string> {
  try {
    // 步骤1: 创建上传任务
    console.log("步骤1: 创建阿里云上传任务...");
    const createUploadResponse = await fetch(
      `${DASHSCOPE_API_BASE}/uploads`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          purpose: "file",
        }),
      }
    );

    if (!createUploadResponse.ok) {
      const errorText = await createUploadResponse.text();
      let errorData: any;
      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = { message: errorText };
      }
      throw new Error(
        `创建上传任务失败 (${createUploadResponse.status}): ${errorData.message || errorData.error || createUploadResponse.statusText}`
      );
    }

    const uploadData = await createUploadResponse.json();
    console.log("上传任务创建成功");

    // 步骤2: 获取上传 URL
    const uploadUrl = uploadData.upload_url || uploadData.url;
    if (!uploadUrl) {
      throw new Error("未获取到上传 URL，响应数据: " + JSON.stringify(uploadData));
    }

    // 步骤3: 上传文件到阿里云 OSS
    console.log("步骤2: 上传文件到阿里云 OSS...");
    const putResponse = await fetch(uploadUrl, {
      method: "PUT",
      body: imageBuffer,
      headers: {
        "Content-Type": contentType,
        ...(uploadData.headers || {}), // 包含阿里云返回的签名头等
      },
    });

    if (!putResponse.ok) {
      const errorText = await putResponse.text();
      throw new Error(`上传文件失败 (${putResponse.status}): ${errorText}`);
    }

    console.log("文件上传成功");

    // 步骤4: 获取上传后的文件 URL
    let fileUrl: string | undefined;

    // 方法1: 从创建上传任务的响应中获取
    if (uploadData.file?.url) {
      fileUrl = uploadData.file.url;
    } else if (uploadData.file_url) {
      fileUrl = uploadData.file_url;
    } else if (uploadData.url && !uploadData.url.includes("upload") && !uploadData.url.includes("sign")) {
      fileUrl = uploadData.url;
    }

    // 方法2: 从上传响应的 Location 头获取
    if (!fileUrl) {
      const location = putResponse.headers.get("Location");
      if (location) {
        fileUrl = location;
      }
    }

    // 方法3: 如果有 upload_id，查询文件信息
    const uploadId = uploadData.upload_id || uploadData.id;
    if (!fileUrl && uploadId) {
      try {
        console.log("步骤3: 查询文件信息...");
        const fileInfoResponse = await fetch(
          `${DASHSCOPE_API_BASE}/files/${uploadId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${apiKey}`,
            },
          }
        );

        if (fileInfoResponse.ok) {
          const fileInfo = await fileInfoResponse.json();
          fileUrl = fileInfo.url || fileInfo.file?.url;
        }
      } catch (queryError) {
        console.warn("查询文件信息失败:", queryError);
      }
    }

    // 验证 URL 格式
    if (!fileUrl || (!fileUrl.startsWith("http://") && !fileUrl.startsWith("https://"))) {
      throw new Error("未获取到有效的文件公网 URL");
    }

    console.log("✅ 图片上传到阿里云成功，URL:", fileUrl);
    return fileUrl;
  } catch (error) {
    console.error("上传图片到阿里云失败:", error);
    throw error;
  }
}

// 创建试衣任务
// 新逻辑：下载图片为 Buffer，上传到阿里云，使用阿里云内部 URL
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { personImageUrl, garmentImageUrl } = body;

    if (!personImageUrl || !garmentImageUrl) {
      return NextResponse.json(
        { error: "缺少必要的参数：需要 personImageUrl 和 garmentImageUrl" },
        { status: 400 }
      );
    }

    // 验证 URL 格式
    if (!personImageUrl.startsWith("http://") && !personImageUrl.startsWith("https://")) {
      return NextResponse.json(
        { error: "personImageUrl 必须是有效的 HTTP/HTTPS URL" },
        { status: 400 }
      );
    }

    if (!garmentImageUrl.startsWith("http://") && !garmentImageUrl.startsWith("https://")) {
      return NextResponse.json(
        { error: "garmentImageUrl 必须是有效的 HTTP/HTTPS URL" },
        { status: 400 }
      );
    }

    const apiKey = process.env.DASHSCOPE_API_KEY || process.env.ALIBABA_CLOUD_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { 
          error: "未配置 API Key。请在环境变量中设置 DASHSCOPE_API_KEY 或 ALIBABA_CLOUD_API_KEY",
        },
        { status: 500 }
      );
    }

    // 步骤1: 下载两张图片为 ArrayBuffer
    console.log("步骤1: 下载图片...");
    console.log("  模特图 URL:", personImageUrl);
    console.log("  服装图 URL:", garmentImageUrl);

    let personImageBuffer: ArrayBuffer;
    let garmentImageBuffer: ArrayBuffer;
    let personContentType = "image/jpeg";
    let garmentContentType = "image/jpeg";

    try {
      const [personResponse, garmentResponse] = await Promise.all([
        fetch(personImageUrl),
        fetch(garmentImageUrl),
      ]);

      if (!personResponse.ok) {
        throw new Error(`下载模特图失败: ${personResponse.status} ${personResponse.statusText}`);
      }
      if (!garmentResponse.ok) {
        throw new Error(`下载服装图失败: ${garmentResponse.status} ${garmentResponse.statusText}`);
      }

      // 获取 Content-Type
      personContentType = personResponse.headers.get("content-type") || "image/jpeg";
      garmentContentType = garmentResponse.headers.get("content-type") || "image/jpeg";

      // 转换为 ArrayBuffer
      personImageBuffer = await personResponse.arrayBuffer();
      garmentImageBuffer = await garmentResponse.arrayBuffer();

      console.log("✅ 图片下载成功");
      console.log("  模特图大小:", personImageBuffer.byteLength, "bytes, 类型:", personContentType);
      console.log("  服装图大小:", garmentImageBuffer.byteLength, "bytes, 类型:", garmentContentType);
    } catch (downloadError) {
      console.error("下载图片失败:", downloadError);
      return NextResponse.json(
        {
          error: `下载图片失败: ${downloadError instanceof Error ? downloadError.message : "未知错误"}`,
        },
        { status: 500 }
      );
    }

    // 步骤2: 上传图片到阿里云临时存储
    let aliPersonImageUrl: string;
    let aliGarmentImageUrl: string;

    try {
      console.log("步骤2: 上传图片到阿里云临时存储...");
      
      // 并行上传两张图片到阿里云
      [aliPersonImageUrl, aliGarmentImageUrl] = await Promise.all([
        uploadImageToDashScope(personImageBuffer, personContentType, apiKey),
        uploadImageToDashScope(garmentImageBuffer, garmentContentType, apiKey),
      ]);

      console.log("✅ 图片上传到阿里云成功:");
      console.log("  模特图 URL:", aliPersonImageUrl);
      console.log("  服装图 URL:", aliGarmentImageUrl);
    } catch (uploadError) {
      console.error("上传图片到阿里云失败:", uploadError);
      return NextResponse.json(
        {
          error: `上传图片到阿里云失败: ${uploadError instanceof Error ? uploadError.message : "未知错误"}`,
        },
        { status: 500 }
      );
    }

    // 步骤3: 使用阿里云返回的 URL 调用试衣 API
    console.log("步骤3: 调用阿里云百炼试衣 API...");
    
    const requestBody = {
      model: "aitryon-plus",
      input: {
        person_image_url: aliPersonImageUrl,
        top_garment_url: aliGarmentImageUrl,
      },
    };
    
    console.log("请求体:", JSON.stringify(requestBody, null, 2));
    
    const response = await fetch(
      `${DASHSCOPE_API_BASE}/services/vision/image-generation/generation`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
          "X-DashScope-Async": "enable",
        },
        body: JSON.stringify(requestBody),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      const errorMessage = data.message || data.error || "创建任务失败";
      
      console.error("❌ 创建试衣任务失败:");
      console.error("  状态码:", response.status);
      console.error("  错误信息:", errorMessage);
      console.error("  完整响应:", JSON.stringify(data, null, 2));
      
      return NextResponse.json(
        { 
          error: errorMessage,
          originalError: errorMessage,
          code: data.code,
          details: data,
        },
        { status: response.status }
      );
    }

    console.log("✅ 试衣任务创建成功，任务 ID:", data.task_id || data.task?.task_id);
    console.log("✅ 返回 200 OK");
    
    return NextResponse.json({
      ...data,
    });
  } catch (error) {
    console.error("创建试衣任务失败:", error);
    
    return NextResponse.json(
      { 
        error: "服务器内部错误",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

// 查询任务状态
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const taskId = searchParams.get("task_id");

    if (!taskId) {
      return NextResponse.json(
        { error: "缺少 task_id 参数" },
        { status: 400 }
      );
    }

    const apiKey = process.env.DASHSCOPE_API_KEY || process.env.ALIBABA_CLOUD_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "未配置 API Key" },
        { status: 500 }
      );
    }

    const response = await fetch(
      `${DASHSCOPE_API_BASE}/tasks/${taskId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.message || "查询任务失败" },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("查询任务状态失败:", error);
    return NextResponse.json(
      { error: "服务器内部错误" },
      { status: 500 }
    );
  }
}
