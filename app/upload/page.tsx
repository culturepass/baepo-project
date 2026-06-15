"use client";

import { useState } from "react";
import { supabase } from "../../lib/supabase";

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);

  async function uploadFile() {
    if (!file) {
      alert("파일을 선택하세요.");
      return;
    }

    const fileName = `${Date.now()}-${file.name}`;

    const { error } = await supabase.storage
      .from("uploads")
      .upload(fileName, file);

    if (error) {
      alert("업로드 실패: " + error.message);
      return;
    }

    alert("파일 업로드 완료");
    setFile(null);
  }

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-20">
      <section className="mx-auto max-w-md rounded-2xl bg-white p-8 shadow">
        <h1 className="mb-6 text-3xl font-bold">파일 업로드</h1>

        <input
          type="file"
          className="mb-4 w-full rounded-xl border px-4 py-3"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />

        <button
          onClick={uploadFile}
          className="w-full rounded-xl bg-blue-600 py-3 font-bold text-white"
        >
          업로드
        </button>
      </section>
    </main>
  );
}