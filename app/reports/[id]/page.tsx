import { ReportDetailPage } from "@/components/report-detail-page"

export default function ReportDetail({ params }: { params: { id: string } }) {
  return <ReportDetailPage reportId={params.id} />
}

// import { db } from "@/lib/firebase"
// import { doc, getDoc } from "firebase/firestore"
// import { notFound } from "next/navigation"

// interface PageProps {
//   params: {
//     id: string
//   }
// }

// export default async function ReportPage({ params }: PageProps) {
//   // ✅ Все в асинхронному контексті
//   const docRef = doc(db, "reports", params.id)
//   const docSnap = await getDoc(docRef)

//   if (!docSnap.exists()) {
//     notFound()
//   }

//   const data = docSnap.data()

//   return (
//     <div className="p-6">
//       <h1 className="text-2xl font-bold mb-2">{data.title}</h1>
//       <p className="mb-4">{data.description}</p>
//       <pre className="text-sm text-gray-500">ID: {params.id}</pre>
//     </div>
//   )
// }
