import { GoogleGenerativeAI } from "@google/generative-ai";

function fallbackEstimate(inquiry: string) {
  const text = inquiry.toLowerCase();

  if (
    text.includes("쇼핑몰") ||
    text.includes("상품") ||
    text.includes("주문") ||
    text.includes("결제")
  ) {
    return {
      summary: "쇼핑몰 구축 문의",
      pages:
        "메인, 상품목록, 상품상세, 장바구니, 주문결제, 마이페이지, 관리자",
      features:
        "상품관리, 주문관리, 회원관리, 결제연동, 배송관리",
      estimated_price: "1,500만원 ~ 4,000만원",
      reply_message:
        "쇼핑몰 구축 문의로 분석되었습니다. 상품관리 및 결제 기능이 핵심입니다.",
    };
  }

  if (
    text.includes("병원") ||
    text.includes("진료") ||
    text.includes("예약")
  ) {
    return {
      summary: "병원 홈페이지 구축 문의",
      pages:
        "메인, 병원소개, 의료진소개, 진료과목, 예약문의, 관리자",
      features:
        "의료진관리, 진료과목관리, 예약문의, 게시판",
      estimated_price: "700만원 ~ 2,000만원",
      reply_message:
        "병원 홈페이지 구축 문의로 분석되었습니다.",
    };
  }

  if (
    text.includes("채용") ||
    text.includes("구인") ||
    text.includes("구직")
  ) {
    return {
      summary: "채용 플랫폼 구축 문의",
      pages:
        "메인, 채용공고, 기업회원, 개인회원, 관리자",
      features:
        "이력서관리, 공고관리, 지원관리",
      estimated_price: "2,000만원 ~ 5,000만원",
      reply_message:
        "채용 플랫폼 구축 문의로 분석되었습니다.",
    };
  }

  return {
    summary: "기업 홈페이지 제작 문의",
    pages:
      "메인, 회사소개, 사업분야, 포트폴리오, 문의하기, 관리자",
    features:
      "게시판, 문의관리, 관리자페이지",
    estimated_price: "500만원 ~ 1,500만원",
    reply_message:
      "기업 홈페이지 구축 문의로 분석되었습니다.",
  };
}

export async function POST(request: Request) {
  try {
    const { inquiry } = await request.json();

    if (!process.env.GEMINI_API_KEY) {
      return Response.json({
        result: JSON.stringify(fallbackEstimate(inquiry)),
        source: "fallback",
      });
    }

    try {
      const genAI = new GoogleGenerativeAI(
        process.env.GEMINI_API_KEY
      );

      const model = genAI.getGenerativeModel({
        model: "gemini-2.5-flash",
      });

      const prompt = `
너는 20년 경력의 웹에이전시 PM이다.

반드시 JSON만 반환한다.

고객 문의:
${inquiry}

{
  "summary":"",
  "pages":"",
  "features":"",
  "estimated_price":"",
  "reply_message":""
}
`;

      const result = await model.generateContent(prompt);

      const response = result.response.text();

      return Response.json({
        result: response,
        source: "gemini",
      });
    } catch (error) {
      console.log("Gemini 실패 → Fallback 사용");

      return Response.json({
        result: JSON.stringify(fallbackEstimate(inquiry)),
        source: "fallback",
      });
    }
  } catch (error) {
    return Response.json(
      {
        error: "서버 오류",
      },
      {
        status: 500,
      }
    );
  }
}