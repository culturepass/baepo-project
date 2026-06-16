"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

type Post = {
  id: number;
  title: string;
  content: string;
  user_email: string | null;
  created_at: string;
};

export default function BoardPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [currentEmail, setCurrentEmail] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const [editId, setEditId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");

  async function getUser() {
    const { data } = await supabase.auth.getUser();
    setCurrentEmail(data.user?.email || null);
  }

  async function getPosts() {
    const { data } = await supabase
      .from("posts")
      .select("*")
      .order("id", { ascending: false });

    setPosts(data || []);
  }

  async function createPost() {
    const { data: userData } = await supabase.auth.getUser();
    const userEmail = userData.user?.email;

    if (!userEmail) {
      alert("로그인 후 게시글을 작성할 수 있습니다.");
      window.location.href = "/login";
      return;
    }

    await supabase.from("posts").insert([
      {
        title,
        content,
        user_email: userEmail,
      },
    ]);

    alert("게시글 등록 완료");
    setTitle("");
    setContent("");
    getPosts();
  }

  function startEdit(post: Post) {
    setEditId(post.id);
    setEditTitle(post.title);
    setEditContent(post.content);
  }

  async function updatePost(id: number) {
    const { error } = await supabase
      .from("posts")
      .update({
        title: editTitle,
        content: editContent,
      })
      .eq("id", id);

    if (error) {
      alert("수정 실패: " + error.message);
      return;
    }

    alert("수정 완료");
    setEditId(null);
    setEditTitle("");
    setEditContent("");
    getPosts();
  }

  async function deletePost(id: number) {
    const ok = confirm("정말 삭제하시겠습니까?");
    if (!ok) return;

    const { error } = await supabase.from("posts").delete().eq("id", id);

    if (error) {
      alert("삭제 실패: " + error.message);
      return;
    }

    alert("삭제 완료");
    getPosts();
  }

  useEffect(() => {
    getUser();
    getPosts();
  }, []);

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-12">
      <section className="mx-auto max-w-3xl rounded-2xl bg-white p-8 shadow">
        <h1 className="mb-6 text-3xl font-bold">게시판</h1>

        <div className="mb-8 grid gap-4">
          <input
            className="rounded-xl border px-4 py-3"
            placeholder="제목"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <textarea
            className="min-h-32 rounded-xl border px-4 py-3"
            placeholder="내용"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />

          <button
            onClick={createPost}
            className="rounded-xl bg-blue-600 py-3 font-bold text-white"
          >
            게시글 등록
          </button>
        </div>

        <div className="grid gap-4">
          {posts.map((post) => (
            <article key={post.id} className="rounded-xl border p-5">
              {editId === post.id ? (
                <div className="grid gap-3">
                  <input
                    className="rounded-xl border px-4 py-3"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                  />

                  <textarea
                    className="min-h-28 rounded-xl border px-4 py-3"
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                  />

                  <div className="flex gap-2">
                    <button
                      onClick={() => updatePost(post.id)}
                      className="rounded-lg bg-green-600 px-4 py-2 text-sm font-bold text-white"
                    >
                      저장
                    </button>

                    <button
                      onClick={() => setEditId(null)}
                      className="rounded-lg bg-gray-500 px-4 py-2 text-sm font-bold text-white"
                    >
                      취소
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <h2 className="text-xl font-bold">{post.title}</h2>
                  <p className="mt-2 text-gray-600">{post.content}</p>
                  <p className="mt-4 text-sm text-gray-400">
                    작성자: {post.user_email || "알 수 없음"}
                  </p>

                  {currentEmail === post.user_email && (
                    <div className="mt-4 flex gap-2">
                      <button
                        onClick={() => startEdit(post)}
                        className="rounded-lg bg-gray-800 px-4 py-2 text-sm font-bold text-white"
                      >
                        수정
                      </button>

                      <button
                        onClick={() => deletePost(post.id)}
                        className="rounded-lg bg-red-600 px-4 py-2 text-sm font-bold text-white"
                      >
                        삭제
                      </button>
                    </div>
                  )}
                </>
              )}
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}