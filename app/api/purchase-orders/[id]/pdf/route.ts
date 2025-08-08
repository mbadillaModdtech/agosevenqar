import { NextRequest, NextResponse } from 'next/server'

// Simple PDF bytes (minimal PDF header) for preview
function simplePdf(text: string) {
  const content = `%PDF-1.1
1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj
2 0 obj<</Type/Pages/Count 1/Kids[3 0 R]>>endobj
3 0 obj<</Type/Page/Parent 2 0 R/MediaBox[0 0 300 144]/Contents 4 0 R/Resources<</Font<</F1 5 0 R>>>>>>endobj
4 0 obj<</Length ${text.length + 73}>>stream
BT /F1 12 Tf 50 100 Td (${text}) Tj ET
endstream endobj
5 0 obj<</Type/Font/Subtype/Type1/BaseFont/Helvetica>>endobj
xref
0 6
0000000000 65535 f 
0000000010 00000 n 
0000000061 00000 n 
0000000114 00000 n 
0000000282 00000 n 
0000000481 00000 n 
trailer<</Size 6/Root 1 0 R>>
startxref
557
%%EOF`
  return new TextEncoder().encode(content)
}

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  const bytes = simplePdf(`PO #${params.id} - QARSPC Preview`)
  return new NextResponse(bytes, { headers: { 'Content-Type': 'application/pdf', 'Content-Disposition': `inline; filename="PO-${params.id}.pdf"` } })
}
