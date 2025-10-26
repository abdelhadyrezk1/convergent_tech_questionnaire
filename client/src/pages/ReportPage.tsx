import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { Download, Printer } from "lucide-react";
import { useLocation } from "wouter";

export default function ReportPage({ questionnaireId }: { questionnaireId: number }) {
  const [, navigate] = useLocation();
  const [reportData, setReportData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const getReportQuery = trpc.report.generate.useQuery({ questionnaireId }, { enabled: !!questionnaireId });

  useEffect(() => {
    if (getReportQuery.data) {
      setReportData(getReportQuery.data);
      setLoading(false);
    }
  }, [getReportQuery.data]);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    toast.success("جاري تحضير ملف PDF...");
    const printWindow = window.open("", "", "height=600,width=800");
    if (printWindow) {
      printWindow.document.write("<html><head><title>Report</title></head><body>");
      printWindow.document.write(document.getElementById("report-content")?.innerHTML || "");
      printWindow.document.write("</body></html>");
      printWindow.document.close();
      setTimeout(() => printWindow.print(), 250);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">جاري تحميل التقرير...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 flex gap-4">
          <Button onClick={handlePrint} className="bg-blue-600"><Printer className="mr-2 h-4 w-4" />طباعة</Button>
          <Button onClick={handleDownloadPDF} className="bg-green-600"><Download className="mr-2 h-4 w-4" />تحميل PDF</Button>
          <Button variant="outline" onClick={() => navigate("/")}>العودة للرئيسية</Button>
        </div>

        <Card>
          <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
            <CardTitle className="text-3xl">Convergent Technology</CardTitle>
            <CardDescription className="text-blue-100">تقرير تقييم مركز البيانات</CardDescription>
          </CardHeader>
          <CardContent className="mt-8">
            <div id="report-content" className="space-y-8">
              {/* Header */}
              <div className="text-center border-b pb-6">
                <h1 className="text-3xl font-bold text-gray-900">Convergent Technology</h1>
                <p className="text-gray-600 mt-2">تقرير تقييم حلول مراكز البيانات</p>
              </div>

              {/* Client Info */}
              {reportData?.questionnaire && (
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold text-gray-900">معلومات العميل</h2>
                  <div className="grid grid-cols-2 gap-4">
                    <div><p className="text-gray-600">اسم العميل</p><p className="font-semibold">{reportData.questionnaire.clientName}</p></div>
                    <div><p className="text-gray-600">مركز البيانات</p><p className="font-semibold">{reportData.questionnaire.dataCenterName}</p></div>
                    <div><p className="text-gray-600">الموقع</p><p className="font-semibold">{reportData.questionnaire.location}</p></div>
                    <div><p className="text-gray-600">جهة الاتصال</p><p className="font-semibold">{reportData.questionnaire.contactName}</p></div>
                  </div>
                </div>
              )}

              {/* DCIM Assessment */}
              {reportData?.dcim && (
                <div className="space-y-4 border-t pt-6">
                  <h2 className="text-2xl font-bold text-gray-900">تقييم نظام DCIM</h2>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-gray-700"><strong>هل يوجد نظام DCIM؟</strong> {reportData.dcim.hasDCIM === "نعم" ? "✓ نعم" : "✗ لا"}</p>
                    <p className="text-gray-700 mt-2"><strong>هل يحتاج العميل إلى DCIM؟</strong> {reportData.dcim.needsDCIM === "نعم" ? "✓ نعم" : reportData.dcim.needsDCIM === "لا" ? "✗ لا" : "⚠ غير متأكد"}</p>
                  </div>
                </div>
              )}

              {/* Assets Summary */}
              {reportData?.assets && reportData.assets.length > 0 && (
                <div className="space-y-4 border-t pt-6">
                  <h2 className="text-2xl font-bold text-gray-900">ملخص الأصول</h2>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="p-2 text-left">النوع</th>
                          <th className="p-2 text-left">المصنع</th>
                          <th className="p-2 text-left">الموديل</th>
                          <th className="p-2 text-left">بروتوكول الشبكة</th>
                          <th className="p-2 text-left">الحالة</th>
                        </tr>
                      </thead>
                      <tbody>
                        {reportData.assets.map((asset: any, i: number) => (
                          <tr key={i} className="border-b">
                            <td className="p-2">{asset.productType}</td>
                            <td className="p-2">{asset.manufacturer}</td>
                            <td className="p-2">{asset.model}</td>
                            <td className="p-2">{asset.specificData?.networkProtocol || asset.specificData?.['بروتوكول الاتصال بالشبكة'] || '-'}</td>
                            <td className="p-2"><span className={`px-2 py-1 rounded text-xs font-semibold ${asset.status === "Active" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}>{asset.status}</span></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Sales Opportunities */}
              {reportData?.opportunities && reportData.opportunities.length > 0 && (
                <div className="space-y-4 border-t pt-6">
                  <h2 className="text-2xl font-bold text-gray-900">الفرص البيعية</h2>
                  <div className="space-y-3">
                    {reportData.opportunities.map((opp: any, i: number) => (
                      <div key={i} className="p-4 border rounded-lg">
                        <p className="font-semibold text-lg">{opp.opportunityType}</p>
                        <p className="text-gray-600 mt-1">{opp.description}</p>
                        <div className="mt-2 flex justify-between text-sm">
                          <span>الأولوية: <strong>{opp.priority}</strong></span>
                          {opp.estimatedValue && <span>القيمة: <strong>{opp.estimatedValue.toLocaleString()} SAR</strong></span>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Footer */}
              <div className="border-t pt-6 mt-8 text-center text-sm text-gray-600">
                <p>تم إنشاء التقرير: {new Date().toLocaleDateString("ar-SA")}</p>
                <p className="mt-2">Convergent Technology | {reportData?.questionnaire?.dataCenterName || "Data Center"} | {reportData?.questionnaire?.clientName || "Client"}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
