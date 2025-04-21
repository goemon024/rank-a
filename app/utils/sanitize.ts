import sanitizeHtml from 'sanitize-html'

export function sanitizeInput(input: string): string {
    return sanitizeHtml(input, {
        allowedTags: [], // 完全にHTMLを排除（プレーンテキスト化）
        allowedAttributes: {}, // 属性も除去
    })
}
