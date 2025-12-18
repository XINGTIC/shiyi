"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";

export default function Home() {
  const [modelImage, setModelImage] = useState<File | null>(null);
  const [garmentImage, setGarmentImage] = useState<File | null>(null);
  const [modelPreview, setModelPreview] = useState<string | null>(null);
  const [garmentPreview, setGarmentPreview] = useState<string | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState<string>("");
  const [taskId, setTaskId] = useState<string | null>(null);
  
  const modelInputRef = useRef<HTMLInputElement>(null);
  const garmentInputRef = useRef<HTMLInputElement>(null);
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // 清理轮询
  useEffect(() => {
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, []);

  // 处理图片预览
  const handleImageUpload = (
    file: File,
    type: "model" | "garment"
  ) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      if (type === "model") {
        setModelPreview(result);
        setModelImage(file);
      } else {
        setGarmentPreview(result);
        setGarmentImage(file);
      }
    };
    reader.readAsDataURL(file);
  };

  // 上传图片到 imgbb 图床（前端直接上传）
  const uploadImageToImgBB = async (file: File): Promise<string> => {
    // 将文件转换为 base64
    const base64 = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        // 提取 base64 数据部分（去掉 data:image/xxx;base64, 前缀）
        const base64Data = result.includes(",") ? result.split(",")[1] : result;
        resolve(base64Data);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

    // 使用 imgbb API 上传
    // 注意：需要在 .env.local 中设置 NEXT_PUBLIC_IMGBB_API_KEY
    const imgbbApiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;
    if (!imgbbApiKey) {
      throw new Error("未配置 IMGBB_API_KEY。请在 .env.local 中设置 NEXT_PUBLIC_IMGBB_API_KEY");
    }

    const formData = new URLSearchParams();
    formData.append("key", imgbbApiKey);
    formData.append("image", base64);

    const response = await fetch("https://api.imgbb.com/1/upload", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formData.toString(),
    });

    const data = await response.json();

    if (data.success) {
      // imgbb API 返回结构：
      // data.data.url - 直接的图片 URL（推荐使用）
      // data.data.image.url - 也是直接的图片 URL
      // data.data.url_viewer - 查看页面 URL（不要用这个）
      // 优先使用 data.data.url，这是直接的图片链接
      let imageUrl = data.data?.url;
      
      // 如果没有 url，尝试 image.url
      if (!imageUrl && data.data?.image?.url) {
        imageUrl = data.data.image.url;
      }
      
      if (!imageUrl) {
        console.error("imgbb 返回数据:", JSON.stringify(data, null, 2));
        throw new Error("未获取到有效的图片 URL");
      }
      
      // 确保 URL 是直接的图片链接（应该以 .jpg, .png 等结尾，或者包含 i.ibb.co 域名）
      // imgbb 的图片 URL 格式通常是：https://i.ibb.co/xxxxx/xxxxx.jpg
      if (!imageUrl.includes("i.ibb.co") && !imageUrl.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
        console.warn("警告：URL 可能不是直接的图片链接:", imageUrl);
        // 如果 data.data.url 不是直接的图片链接，尝试使用 image.url
        if (data.data?.image?.url) {
          imageUrl = data.data.image.url;
          console.log("使用 image.url:", imageUrl);
        }
      }
      
      console.log("✅ imgbb 上传成功，图片 URL:", imageUrl);
      return imageUrl;
    } else {
      console.error("imgbb 上传失败:", data);
      throw new Error(data.error?.message || data.message || "上传到图床失败");
    }
  };

  // 轮询任务状态
  const pollTaskStatus = async (taskId: string) => {
    try {
      const response = await fetch(`/api/aliyun/tryon?task_id=${taskId}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "查询任务失败");
      }

      const status = data.task?.status || data.status;

      if (status === "SUCCEEDED") {
        // 任务成功，获取结果图片 URL
        const output = data.task?.output || data.output;
        if (output?.image_url) {
          setResultImage(output.image_url);
          setProgress("生成完成！");
        } else if (output?.images && output.images[0]?.url) {
          setResultImage(output.images[0].url);
          setProgress("生成完成！");
        }
        setIsGenerating(false);
        if (pollingIntervalRef.current) {
          clearInterval(pollingIntervalRef.current);
          pollingIntervalRef.current = null;
        }
      } else if (status === "FAILED") {
        throw new Error(data.task?.message || "任务执行失败");
      } else {
        // 任务还在处理中，继续轮询
        setProgress(`处理中... (${status})`);
      }
    } catch (error) {
      console.error("查询任务状态失败:", error);
      setIsGenerating(false);
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
      }
      alert(error instanceof Error ? error.message : "查询任务状态失败");
    }
  };

  // 生成试衣效果
  const handleGenerate = async () => {
    if (!modelImage || !garmentImage) {
      alert("请先上传模特图和服装图");
      return;
    }

    setIsGenerating(true);
    setProgress("正在准备图片...");
    setResultImage(null);
    setTaskId(null);

    // 清理之前的轮询
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }

    try {
      // 步骤1: 前端直接上传图片到 imgbb 图床
      setProgress("正在上传图片到图床...");
      
      let personImageUrl: string;
      let garmentImageUrl: string;
      
      try {
        [personImageUrl, garmentImageUrl] = await Promise.all([
          uploadImageToImgBB(modelImage),
          uploadImageToImgBB(garmentImage),
        ]);
        
        console.log("✅ 图片上传到图床成功:");
        console.log("  模特图 URL:", personImageUrl);
        console.log("  服装图 URL:", garmentImageUrl);
        
        // 验证 URL 格式
        if (!personImageUrl.startsWith("http://") && !personImageUrl.startsWith("https://")) {
          throw new Error("模特图 URL 格式不正确");
        }
        if (!garmentImageUrl.startsWith("http://") && !garmentImageUrl.startsWith("https://")) {
          throw new Error("服装图 URL 格式不正确");
        }
      } catch (uploadError) {
        console.error("图片上传失败:", uploadError);
        throw new Error(
          uploadError instanceof Error 
            ? uploadError.message 
            : "图片上传到图床失败，请重试"
        );
      }

      // 步骤2: 等待几秒确保 CDN 生效，然后将 URL 发送给后端
      setProgress("等待图片 CDN 生效...");
      await new Promise(resolve => setTimeout(resolve, 2000)); // 等待 2 秒
      
      setProgress("正在创建试衣任务...");

      const response = await fetch("/api/aliyun/tryon", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          personImageUrl,
          garmentImageUrl,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "创建任务失败");
      }

      // 获取任务 ID
      const newTaskId = data.task_id || data.task?.task_id;
      if (!newTaskId) {
        throw new Error("未获取到任务 ID");
      }

      setTaskId(newTaskId);
      setProgress("任务已创建，正在处理...");

      // 开始轮询任务状态
      // 立即查询一次
      await pollTaskStatus(newTaskId);

      // 设置定时轮询（每 3 秒查询一次）
      pollingIntervalRef.current = setInterval(() => {
        pollTaskStatus(newTaskId);
      }, 3000);
    } catch (error) {
      console.error("生成失败:", error);
      setIsGenerating(false);
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
      }
      alert(error instanceof Error ? error.message : "生成失败，请重试");
      setProgress("");
    }
  };

  // 下载结果图片
  const handleDownload = async () => {
    if (!resultImage) return;

    try {
      const response = await fetch(resultImage);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `ai-try-on-${Date.now()}.jpg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("下载失败:", error);
      alert("下载失败，请重试");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* 标题 */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
            AI 服装试衣间
          </h1>
          <p className="text-gray-600 text-lg">
            上传模特图和服装图，一键生成 AI 试衣效果（基于阿里云百炼）
          </p>
        </div>

        {/* 主要内容区域 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* 左侧：上传区域 */}
          <div className="lg:col-span-4 space-y-6">
            {/* 模特图上传卡片 */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                真人模特图
              </h2>
              <div
                onClick={() => modelInputRef.current?.click()}
                className="relative border-2 border-dashed border-gray-300 rounded-lg p-8 cursor-pointer hover:border-blue-400 transition-colors bg-gray-50"
              >
                <input
                  ref={modelInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleImageUpload(file, "model");
                  }}
                />
                {modelPreview ? (
                  <div className="relative w-full aspect-square rounded-lg overflow-hidden">
                    <Image
                      src={modelPreview}
                      alt="模特预览"
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center text-gray-400">
                    <svg
                      className="w-16 h-16 mb-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                    <p className="text-sm">点击上传模特图</p>
                  </div>
                )}
              </div>
            </div>

            {/* 服装图上传卡片 */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                服装平铺图
              </h2>
              <div
                onClick={() => garmentInputRef.current?.click()}
                className="relative border-2 border-dashed border-gray-300 rounded-lg p-8 cursor-pointer hover:border-blue-400 transition-colors bg-gray-50"
              >
                <input
                  ref={garmentInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleImageUpload(file, "garment");
                  }}
                />
                {garmentPreview ? (
                  <div className="relative w-full aspect-square rounded-lg overflow-hidden">
                    <Image
                      src={garmentPreview}
                      alt="服装预览"
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center text-gray-400">
                    <svg
                      className="w-16 h-16 mb-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                    <p className="text-sm">点击上传服装图</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 中间：生成按钮 */}
          <div className="lg:col-span-1 flex items-center justify-center">
            <button
              onClick={handleGenerate}
              disabled={isGenerating || !modelImage || !garmentImage}
              className="w-full lg:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold text-lg rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105 active:scale-95"
            >
              {isGenerating ? (
                <span className="flex items-center gap-2">
                  <svg
                    className="animate-spin h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  生成中...
                </span>
              ) : (
                "一键生成 AI 试衣效果"
              )}
            </button>
          </div>

          {/* 右侧：预览区域 */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 h-full">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                预览效果
              </h2>
              <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-gray-100 border-2 border-gray-200">
                {isGenerating ? (
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    {/* Loading 骨架屏 */}
                    <div className="w-full h-full animate-pulse bg-gradient-to-br from-gray-200 to-gray-300">
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <svg
                          className="animate-spin h-12 w-12 text-blue-600 mb-4"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        <p className="text-gray-600 font-medium">{progress || "正在生成..."}</p>
                        {taskId && (
                          <p className="text-gray-500 text-sm mt-2">任务 ID: {taskId.slice(0, 8)}...</p>
                        )}
                      </div>
                    </div>
                  </div>
                ) : resultImage ? (
                  <>
                    <Image
                      src={resultImage}
                      alt="试衣效果"
                      fill
                      className="object-contain"
                    />
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                      <button
                        onClick={handleDownload}
                        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                          />
                        </svg>
                        下载高清图
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                    <div className="text-center">
                      <svg
                        className="w-20 h-20 mx-auto mb-4 opacity-50"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      <p className="text-lg">生成的效果将显示在这里</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
