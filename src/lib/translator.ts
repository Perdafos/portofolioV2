export async function translateText(text: string, targetLang: string): Promise<string> {
  if (!text || !text.trim()) return text;
  
  const targetCode = targetLang === "id" ? "id" : "en";
  // Create a relatively unique but short cache key (changed prefix to tr4 to bust cache)
  const cacheKey = `tr4_${targetCode}_${text.length}_${text.substring(0, 30).replace(/[^a-zA-Z0-9]/g, '')}`;
  const cached = sessionStorage.getItem(cacheKey);
  if (cached) return cached;

  // Extract code blocks to prevent translation of code
  const codeBlocks: string[] = [];
  
  // Replace code blocks and make the placeholder extremely distinct so Google Translate doesn't mess with it
  let processedText = text.replace(/```[\s\S]*?```/g, (match) => {
    codeBlocks.push(match);
    return ` ZZZBLOCKZZZ_${codeBlocks.length - 1}_OOO `;
  });
  processedText = processedText.replace(/`[^`]+`/g, (match) => {
    codeBlocks.push(match);
    return ` ZZZINLINEZZZ_${codeBlocks.length - 1}_OOO `;
  });

  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetCode}&dt=t`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({ q: processedText }),
    });
    
    if (!response.ok) throw new Error("Translation request failed");
    
    const data = await response.json();
    let translatedText = data[0].map((item: any) => item[0]).join("");

    // Restore code blocks
    translatedText = translatedText.replace(/ZZZBLOCKZZZ\s*_\s*(\d+)\s*_\s*OOO/gi, (_: string, index: string) => {
      return "\n\n" + (codeBlocks[Number(index)] || "") + "\n\n";
    });
    translatedText = translatedText.replace(/ZZZINLINEZZZ\s*_\s*(\d+)\s*_\s*OOO/gi, (_: string, index: string) => {
      return codeBlocks[Number(index)] || "";
    });

    sessionStorage.setItem(cacheKey, translatedText);
    return translatedText;
  } catch (error) {
    console.error("Translation error:", error);
    return text;
  }
}


