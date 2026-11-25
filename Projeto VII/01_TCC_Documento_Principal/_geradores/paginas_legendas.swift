// Lê o PDF do relatório e devolve, em JSON, a página de cada legenda: {"Figura 1": 82, ...}
// Ignora as páginas antes da introdução (capa, resumo, listas e sumário).
import Foundation
import PDFKit

let doc = PDFDocument(url: URL(fileURLWithPath: CommandLine.arguments[1]))!
var inicio = 0
var paginas: [String: Int] = [:]
let re = try! NSRegularExpression(pattern: "^(Figura|Quadro|Tabela) (\\d+) [—–-] ", options: [.anchorsMatchLines])
for i in 0..<doc.pageCount {
    let texto = doc.page(at: i)?.string ?? ""
    if inicio == 0 {
        if texto.range(of: "^1 INTRODUÇÃO$", options: .regularExpression) != nil
            || texto.components(separatedBy: "\n").contains(where: { $0.trimmingCharacters(in: .whitespaces) == "1 INTRODUÇÃO" }) {
            inicio = i
        } else { continue }
    }
    let ns = texto as NSString
    for m in re.matches(in: texto, range: NSRange(location: 0, length: ns.length)) {
        let chave = ns.substring(with: m.range(at: 1)) + " " + ns.substring(with: m.range(at: 2))
        if paginas[chave] == nil { paginas[chave] = i + 1 }
    }
}
let ordenado = paginas.keys.sorted()
let json = "{" + ordenado.map { "\"\($0)\": \(paginas[$0]!)" }.joined(separator: ", ") + "}"
print(json)
