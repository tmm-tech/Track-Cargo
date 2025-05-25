// helpers/loadHtml2PdfLibrary.js
export const loadHtml2PdfLibrary = () => {
  return new Promise((resolve, reject) => {
    if (window.html2pdf) return resolve()

    const script = document.createElement('script')
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js'
    script.onload = () => resolve()
    script.onerror = () => reject(new Error('Failed to load html2pdf library'))
    document.head.appendChild(script)
  })
}