"use client";

import { useEffect, useState } from "react";
import AppLayout from "../../components/AppLayout";
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
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .order("id", { ascending: false });

    if (error) {
      alert("게시글 불러오기 실패: " + error.message);
      return;
    }

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

    if (!title.trim() || !content.trim()) {
      alert("제목과 내용을 모두 입력하세요.");
      return;
    }

    const { error } = await supabase.from("posts").insert([
      {
        title,
        content,
        user_email: userEmail,
      },
    ]);

    if (error) {
      alert("게시글 등록 실패: " + error.message);
      return;
    }

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
    if (!editTitle.trim() || !editContent.trim()) {
      alert("제목과 내용을 모두 입력하세요.");
      return;
    }

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
    <AppLayout>
      <section className="p-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8">
            <p className="mb-2 text-sm font-bold text-blue-600">
              Board
            </p>

            <h1 className="text-3xl font-bold text-gray-900">
              게시판
            </h1>

            <p className="mt-2 text-gray-600">
              내부 공지, 자료, 테스트 게시글을 작성하고 관리합니다.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900">
                게시글 작성
              </h2>

              <p className="mt-2 text-sm text-gray-500">
                로그인한 사용자만 게시글을 등록할 수 있습니다.
              </p>

              <div className="mt-6 grid gap-4">
                <input
                  className="rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-blue-500"
                  placeholder="제목"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />

                <textarea
                  className="min-h-40 resize-none rounded-xl border border-gray-200 px-4 py-3 leading-7 outline-none focus:border-blue-500"
                  placeholder="내용"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                />

                <button
                  onClick={createPost}
                  className="rounded-xl bg-blue-600 py-3 font-bold text-white hover:bg-blue-700"
                >
                  게시글 등록
                </button>
              </div>
            </div>

            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
              <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    게시글 목록
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    총 {posts.length}개의 게시글
                  </p>
                </div>
              </div>

              <div className="grid gap-4">
                {posts.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-gray-200 p-10 text-center text-sm text-gray-400">
                    등록된 게시글이 없습니다.
                  </div>
                ) : (
                  posts.map((post) => (
                    <article
                      key={post.id}
                      className="rounded-2xl border border-gray-100 p-5 transition hover:bg-gray-50"
                    >
                      {editId === post.id ? (
                        <div className="grid gap-3">
                          <input
                            className="rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-blue-500"
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                          />

                          <textarea
                            className="min-h-32 resize-none rounded-xl border border-gray-200 px-4 py-3 leading-7 outline-none focus:border-blue-500"
                            value={editContent}
                            onChange={(e) => setEditContent(e.target.value)}
                          />

                          <div className="flex flex-wrap gap-2">
                            <button
                              onClick={() => updatePost(post.id)}
                              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-bold text-white hover:bg-blue-700"
                            >
                              저장
                            </button>

                            <button
                              onClick={() => setEditId(null)}
                              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-bold text-gray-700 hover:bg-gray-100"
                            >
                              취소
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="flex flex-wrap items-start justify-between gap-3">
                            <div>
                              <h3 className="text-lg font-bold text-gray-900">
                                {post.title}
                              </h3>

                              <p className="mt-1 text-xs text-gray-400">
                                작성자: {post.user_email || "알 수 없음"}
                              </p>
                            </div>

                            <p className="text-xs text-gray-400">
                              {new Date(post.created_at).toLocaleString()}
                            </p>
                          </div>

                          <p className="mt-4 whitespace-pre-wrap rounded-xl bg-gray-50 p-4 text-sm leading-7 text-gray-700">
                            {post.content}
                          </p>

                          {currentEmail === post.user_email && (
                            <div className="mt-4 flex flex-wrap gap-2">
                              <button
                                onClick={() => startEdit(post)}
                                className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-bold text-white hover:bg-black"
                              >
                                수정
                              </button>

                              <button
                                onClick={() => deletePost(post.id)}
                                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-bold text-white hover:bg-red-700"
                              >
                                삭제
                              </button>
                            </div>
                          )}
                        </>
                      )}
                    </article>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </AppLayout>
  );
}