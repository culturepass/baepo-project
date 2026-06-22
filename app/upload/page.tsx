"use client";

import { useState } from "react";
import AppLayout from "../../components/AppLayout";
import { supabase } from "../../lib/supabase";

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  async function uploadFile() {
    if (!file) {
      alert("파일을 선택하세요.");
      return;
    }

    setLoading(true);

    const fileName = `${Date.now()}-${file.name}`;

    const { error } = await supabase.storage
      .from("uploads")
      .upload(fileName, file);

    setLoading(false);

    if (error) {
      alert("업로드 실패: " + error.message);
      return;
    }

    alert("파일 업로드 완료");
    setFile(null);
  }

  return (
    <AppLayout>
      <section className="p-8">
        <div className="mx-auto max-w-5xl">
          <div className="mb-8">
            <p className="mb-2 text-sm font-bold text-blue-600">
              File Upload
            </p>

            <h1 className="text-3xl font-bold text-gray-900">
              파일 업로드
            </h1>

            <p className="mt-2 text-gray-600">
              프로젝트 자료 및 첨부파일을 업로드합니다.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1fr_0.8fr]">
            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900">
                파일 선택
              </h2>

              <div className="mt-6">
                <input
                  type="file"
                  className="w-full rounded-xl border border-gray-200 px-4 py-3"
                  onChange={(e) =>
                    setFile(e.target.files?.[0] || null)
                  }
                />
              </div>

              {file && (
                <div className="mt-5 rounded-xl bg-gray-50 p-4">
                  <p className="text-sm font-bold text-gray-700">
                    선택 파일
                  </p>

                  <p className="mt-2 text-sm text-gray-500">
                    {file.name}
                  </p>
                </div>
              )}

              <button
                onClick={uploadFile}
                disabled={loading}
                className="mt-6 w-full rounded-xl bg-blue-600 py-3 font-bold text-white hover:bg-blue-700 disabled:bg-gray-400"
              >
                {loading ? "업로드 중..." : "파일 업로드"}
              </button>
            </div>

            <div className="space-y-6">
              <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                <h2 className="text-xl font-bold text-gray-900">
                  업로드 안내
                </h2>

                <ul className="mt-5 space-y-3 text-sm leading-6 text-gray-600">
                  <li>• 제안서 및 기획서 업로드</li>
                  <li>• 고객 자료 첨부</li>
                  <li>• 디자인 시안 업로드</li>
                  <li>• 프로젝트 파일 보관</li>
                </ul>
              </div>

              <div className="rounded-2xl border border-blue-100 bg-blue-50 p-6">
                <p className="text-sm font-bold text-blue-700">
                  Supabase Storage
                </p>

                <p className="mt-2 text-sm leading-6 text-blue-800">
                  업로드된 파일은 Supabase Storage uploads 버킷에 저장됩니다.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </AppLayout>
  );
}