import { NextRequest, NextResponse } from "next/server";

const DASHSCOPE_API_BASE = "https://dashscope.aliyuncs.com/api/v1";

// 创建试衣任务
// 部署到 Cloudflare Pages 后，imgbb URL 可以直接被阿里云访问
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

    // 确保使用 HTTPS
    const finalPersonUrl = personImageUrl.startsWith("http://") 
      ? personImageUrl.replace("http://", "https://") 
      : personImageUrl;
    const finalGarmentUrl = garmentImageUrl.startsWith("http://") 
      ? garmentImageUrl.replace("http://", "https://") 
      : garmentImageUrl;

    const apiKey = process.env.DASHSCOPE_API_KEY || process.env.ALIBABA_CLOUD_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { 
          error: "未配置 API Key。请在环境变量中设置 DASHSCOPE_API_KEY 或 ALIBABA_CLOUD_API_KEY",
        },
        { status: 500 }
      );
    }

    // 构建请求体
    const requestBody = {
      model: "aitryon-plus",
      input: {
        person_image_url: finalPersonUrl,
        top_garment_url: finalGarmentUrl,
      },
    };
    
    console.log("🚀 调用阿里云百炼试衣 API...");
    console.log("  模特图 URL:", finalPersonUrl);
    console.log("  服装图 URL:", finalGarmentUrl);
    console.log("  请求体:", JSON.stringify(requestBody, null, 2));
    
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
