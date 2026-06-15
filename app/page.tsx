export default function Home() {
  return (
    <main>
      <header className="flex items-center justify-between px-8 py-5 border-b">
        <h1 className="text-2xl font-bold">BAEPO</h1>

        <nav className="hidden md:flex gap-6 text-sm text-gray-600">
          <a href="#about">소개</a>
          <a href="#board">게시판</a>
          <a href="#contact">문의하기</a>
          <a href="#login">로그인</a>
        </nav>
      </header>

      <section className="min-h-[80vh] flex flex-col items-center justify-center text-center px-6 bg-gray-50">
        <p className="mb-4 text-blue-600 font-semibold">
          My First Real Web Service
        </p>

        <h2 className="text-4xl md:text-6xl font-extrabold leading-tight mb-6">
          처음부터 배포까지,
          <br />
          실제 서비스형 홈페이지
        </h2>

        <p className="text-gray-600 text-lg md:text-xl max-w-2xl mb-8">
          회원가입, 로그인, 게시판, 문의하기, 관리자 페이지까지
          단계별로 구현하는 반응형 웹사이트입니다.
        </p>

        <div className="flex gap-4">
          <a
            href="#contact"
            className="rounded-full bg-blue-600 px-6 py-3 text-white font-semibold"
          >
            문의하기
          </a>

          <a
            href="#about"
            className="rounded-full border px-6 py-3 font-semibold"
          >
            자세히 보기
          </a>
        </div>
      </section>

      <section id="about" className="px-8 py-20 max-w-6xl mx-auto">
        <h3 className="text-3xl font-bold mb-10">서비스 소개</h3>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="rounded-2xl border p-6">
            <h4 className="text-xl font-bold mb-3">반응형 홈페이지</h4>
            <p className="text-gray-600">
              PC, 태블릿, 모바일에서 모두 보기 좋은 화면을 제공합니다.
            </p>
          </div>

          <div className="rounded-2xl border p-6">
            <h4 className="text-xl font-bold mb-3">회원 기능</h4>
            <p className="text-gray-600">
              회원가입, 로그인, 권한 관리를 단계적으로 구현합니다.
            </p>
          </div>

          <div className="rounded-2xl border p-6">
            <h4 className="text-xl font-bold mb-3">관리자 페이지</h4>
            <p className="text-gray-600">
              게시글, 문의, 회원 정보를 관리할 수 있는 화면을 만듭니다.
            </p>
          </div>
        </div>
      </section>

      <section id="board" className="px-8 py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-3xl font-bold mb-10">최근 게시글</h3>

          <div className="grid gap-4">
            {["공지사항입니다", "서비스 준비 중입니다", "첫 게시글입니다"].map(
              (title, index) => (
                <div
                  key={index}
                  className="rounded-xl border bg-white p-5 flex justify-between"
                >
                  <span>{title}</span>
                  <span className="text-gray-400">2026.06.15</span>
                </div>
              )
            )}
          </div>
        </div>
      </section>

      <section id="contact" className="px-8 py-20 max-w-3xl mx-auto">
        <h3 className="text-3xl font-bold mb-8">문의하기</h3>

        <form className="grid gap-4">
          <input
            className="border rounded-xl px-4 py-3"
            placeholder="이름"
          />
          <input
            className="border rounded-xl px-4 py-3"
            placeholder="이메일"
          />
          <textarea
            className="border rounded-xl px-4 py-3 min-h-40"
            placeholder="문의 내용"
          />
          <button
            type="button"
            className="rounded-xl bg-blue-600 text-white py-3 font-bold"
          >
            문의 보내기
          </button>
        </form>
      </section>

      <footer className="border-t px-8 py-8 text-center text-gray-500">
        © 2026 BAEPO. All rights reserved.
      </footer>
    </main>
  );
}