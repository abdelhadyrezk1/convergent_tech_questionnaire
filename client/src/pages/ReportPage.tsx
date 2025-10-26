import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { Download, Printer, ArrowRight } from "lucide-react";
import { useLocation } from "wouter";
import { useState, useEffect } from "react";

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
      printWindow.document.write("<html><head><title>Report</title><style>");
      printWindow.document.write(`
        body { font-family: Arial, sans-serif; margin: 20px; direction: rtl; }
        .header { text-align: center; border-bottom: 3px solid #C41E3A; padding-bottom: 20px; margin-bottom: 20px; }
        .logo { max-width: 150px; margin-bottom: 10px; }
        .title { color: #C41E3A; font-size: 24px; font-weight: bold; }
        .subtitle { color: #0099D8; font-size: 14px; margin-top: 5px; }
        .section { margin-bottom: 25px; page-break-inside: avoid; }
        .section-title { color: #C41E3A; font-size: 18px; font-weight: bold; border-bottom: 2px solid #0099D8; padding-bottom: 10px; margin-bottom: 15px; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 15px; }
        th { background-color: #003D82; color: white; padding: 12px; text-align: right; font-weight: bold; border: 1px solid #003D82; }
        td { padding: 10px; border: 1px solid #ddd; text-align: right; }
        tr:nth-child(even) { background-color: #f9f9f9; }
        .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 15px; }
        .info-item { background-color: #f5f5f5; padding: 12px; border-left: 4px solid #0099D8; }
        .info-label { color: #666; font-size: 12px; font-weight: bold; }
        .info-value { color: #333; font-size: 14px; margin-top: 5px; }
        .status-badge { display: inline-block; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: bold; }
        .status-active { background-color: #2D7A4A; color: white; }
        .status-standby { background-color: #FFA500; color: white; }
        .status-other { background-color: #999; color: white; }
        .footer { border-top: 2px solid #C41E3A; padding-top: 15px; margin-top: 30px; text-align: center; font-size: 12px; color: #666; }
        .footer-logo { max-width: 100px; margin-top: 10px; }
        @media print { body { margin: 0; } }
      `);
      printWindow.document.write("</style></head><body>");
      printWindow.document.write(document.getElementById("report-content")?.innerHTML || "");
      printWindow.document.write("</body></html>");
      printWindow.document.close();
      setTimeout(() => printWindow.print(), 250);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen text-lg">جاري تحميل التقرير...</div>;
  }

  const getStatusBadgeClass = (status: string) => {
    if (status === "Active") return "status-active";
    if (status === "Standby") return "status-standby";
    return "status-other";
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6 flex gap-4 flex-wrap">
          <Button onClick={handlePrint} className="bg-blue-600 hover:bg-blue-700">
            <Printer className="mr-2 h-4 w-4" />
            طباعة
          </Button>
          <Button onClick={handleDownloadPDF} className="bg-green-600 hover:bg-green-700">
            <Download className="mr-2 h-4 w-4" />
            تحميل PDF
          </Button>
          <Button variant="outline" onClick={() => navigate("/")}>
            <ArrowRight className="mr-2 h-4 w-4" />
            العودة للرئيسية
          </Button>
        </div>

        <Card className="shadow-lg">
          <CardContent className="p-0">
            <div id="report-content" className="space-y-0">
              {/* Header with Logo */}
              <div className="bg-gradient-to-r from-red-600 to-red-700 text-white p-8 text-center">
                <div className="flex justify-center mb-4">
                  <img src="/logos/convergent-technology.webp" alt="Convergent Technology" className="h-16" />
                </div>
                <h1 className="text-4xl font-bold mb-2">Convergent Technology</h1>
                <p className="text-xl text-red-100">تقرير تقييم حلول مراكز البيانات</p>
                <p className="text-sm text-red-100 mt-2">Data Center Assessment Report</p>
              </div>

              {/* Report Date */}
              <div className="bg-gray-100 px-8 py-4 text-center border-b-2 border-blue-600">
                <p className="text-gray-700">
                  <strong>تاريخ التقرير:</strong> {new Date().toLocaleDateString("ar-SA")} | 
                  <strong className="mr-4">Report Date:</strong> {new Date().toLocaleDateString("en-US")}
                </p>
              </div>

              <div className="p-8">
                {/* Client Information Section */}
                {reportData?.questionnaire && (
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold text-red-700 border-b-2 border-blue-600 pb-3 mb-6">معلومات العميل | Client Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-blue-50 p-4 border-l-4 border-blue-600">
                        <p className="text-gray-600 text-sm font-bold">اسم العميل</p>
                        <p className="text-gray-900 font-semibold text-lg mt-1">{reportData.questionnaire.clientName}</p>
                      </div>
                      <div className="bg-blue-50 p-4 border-l-4 border-blue-600">
                        <p className="text-gray-600 text-sm font-bold">Data Center Name</p>
                        <p className="text-gray-900 font-semibold text-lg mt-1">{reportData.questionnaire.dataCenterName}</p>
                      </div>
                      <div className="bg-blue-50 p-4 border-l-4 border-blue-600">
                        <p className="text-gray-600 text-sm font-bold">الموقع</p>
                        <p className="text-gray-900 font-semibold text-lg mt-1">{reportData.questionnaire.location}</p>
                      </div>
                      <div className="bg-blue-50 p-4 border-l-4 border-blue-600">
                        <p className="text-gray-600 text-sm font-bold">العنوان</p>
                        <p className="text-gray-900 font-semibold text-lg mt-1">{reportData.questionnaire.address || "غير محدد"}</p>
                      </div>
                      <div className="bg-green-50 p-4 border-l-4 border-green-600">
                        <p className="text-gray-600 text-sm font-bold">مهندس المشروع</p>
                        <p className="text-gray-900 font-semibold text-lg mt-1">{reportData.questionnaire.engineerName}</p>
                      </div>
                      <div className="bg-green-50 p-4 border-l-4 border-green-600">
                        <p className="text-gray-600 text-sm font-bold">تاريخ الزيارة</p>
                        <p className="text-gray-900 font-semibold text-lg mt-1">{new Date(reportData.questionnaire.visitDate).toLocaleDateString("ar-SA")}</p>
                      </div>
                    </div>

                    {/* Contact Person Information */}
                    <div className="mt-6 bg-purple-50 p-6 border-2 border-purple-300 rounded-lg">
                      <h3 className="text-lg font-bold text-purple-700 mb-4">بيانات مسئول الاتصال | Contact Person Details</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-gray-600 text-sm font-bold">الاسم</p>
                          <p className="text-gray-900 font-semibold">{reportData.questionnaire.contactName}</p>
                        </div>
                        <div>
                          <p className="text-gray-600 text-sm font-bold">الوظيفة</p>
                          <p className="text-gray-900 font-semibold">{reportData.questionnaire.contactJobTitle}</p>
                        </div>
                        <div>
                          <p className="text-gray-600 text-sm font-bold">رقم الهاتف</p>
                          <p className="text-gray-900 font-semibold">{reportData.questionnaire.contactPhone}</p>
                        </div>
                        <div>
                          <p className="text-gray-600 text-sm font-bold">البريد الإلكتروني</p>
                          <p className="text-gray-900 font-semibold">{reportData.questionnaire.contactEmail}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* DCIM Assessment Section */}
                {reportData?.dcim && (
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold text-red-700 border-b-2 border-blue-600 pb-3 mb-6">تقييم نظام DCIM | DCIM Assessment</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-green-50 p-6 border-2 border-green-300 rounded-lg">
                        <p className="text-gray-600 text-sm font-bold mb-2">هل يوجد نظام DCIM؟</p>
                        <p className="text-2xl font-bold">
                          {reportData.dcim.hasDCIM === "نعم" ? (
                            <span className="text-green-600">✓ نعم</span>
                          ) : (
                            <span className="text-red-600">✗ لا</span>
                          )}
                        </p>
                      </div>
                      <div className="bg-orange-50 p-6 border-2 border-orange-300 rounded-lg">
                        <p className="text-gray-600 text-sm font-bold mb-2">هل يحتاج العميل إلى DCIM؟</p>
                        <p className="text-2xl font-bold">
                          {reportData.dcim.needsDCIM === "نعم" ? (
                            <span className="text-green-600">✓ نعم</span>
                          ) : reportData.dcim.needsDCIM === "لا" ? (
                            <span className="text-red-600">✗ لا</span>
                          ) : (
                            <span className="text-orange-600">⚠ غير متأكد</span>
                          )}
                        </p>
                      </div>
                    </div>
                    {reportData.dcim.dcimSystemName && (
                      <div className="mt-4 bg-blue-50 p-4 border-l-4 border-blue-600">
                        <p className="text-gray-600 text-sm font-bold">نظام DCIM الحالي</p>
                        <p className="text-gray-900 font-semibold mt-1">{reportData.dcim.dcimSystemName}</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Assets Section */}
                {reportData?.assets && reportData.assets.length > 0 && (
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold text-red-700 border-b-2 border-blue-600 pb-3 mb-6">ملخص الأصول | Assets Summary</h2>
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="bg-gradient-to-r from-gray-800 to-gray-900 text-white">
                            <th className="border-2 border-gray-800 p-3 text-right font-bold">نوع المنتج</th>
                            <th className="border-2 border-gray-800 p-3 text-right font-bold">المصنع</th>
                            <th className="border-2 border-gray-800 p-3 text-right font-bold">الموديل</th>
                            <th className="border-2 border-gray-800 p-3 text-right font-bold">الكمية</th>
                            <th className="border-2 border-gray-800 p-3 text-right font-bold">بروتوكول الشبكة</th>
                            <th className="border-2 border-gray-800 p-3 text-right font-bold">الحساسات</th>
                            <th className="border-2 border-gray-800 p-3 text-right font-bold">الحالة</th>
                          </tr>
                        </thead>
                        <tbody>
                          {reportData.assets.map((asset: any, i: number) => (
                            <tr key={i} className={i % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                              <td className="border border-gray-300 p-3">{asset.productType}</td>
                              <td className="border border-gray-300 p-3">{asset.manufacturer || "-"}</td>
                              <td className="border border-gray-300 p-3">{asset.model || "-"}</td>
                              <td className="border border-gray-300 p-3 text-center">{asset.unitCount || 1}</td>
                              <td className="border border-gray-300 p-3">{asset.specificData?.networkProtocol || "-"}</td>
                              <td className="border border-gray-300 p-3">{asset.sensors || "-"}</td>
                              <td className="border border-gray-300 p-3 text-center">
                                <span className={`px-3 py-1 rounded text-xs font-bold text-white ${getStatusBadgeClass(asset.status)}`}>
                                  {asset.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Sales Opportunities Section */}
                {reportData?.opportunities && reportData.opportunities.length > 0 && (
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold text-red-700 border-b-2 border-blue-600 pb-3 mb-6">الفرص البيعية | Sales Opportunities</h2>
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="bg-gradient-to-r from-green-700 to-green-800 text-white">
                            <th className="border-2 border-green-700 p-3 text-right font-bold">نوع الفرصة</th>
                            <th className="border-2 border-green-700 p-3 text-right font-bold">الوصف</th>
                            <th className="border-2 border-green-700 p-3 text-right font-bold">الأولوية</th>
                            <th className="border-2 border-green-700 p-3 text-right font-bold">القيمة المتوقعة</th>
                            <th className="border-2 border-green-700 p-3 text-right font-bold">تاريخ المتابعة</th>
                          </tr>
                        </thead>
                        <tbody>
                          {reportData.opportunities.map((opp: any, i: number) => (
                            <tr key={i} className={i % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                              <td className="border border-gray-300 p-3 font-semibold">{opp.opportunityType}</td>
                              <td className="border border-gray-300 p-3">{opp.description || "-"}</td>
                              <td className="border border-gray-300 p-3 text-center">
                                <span className={`px-3 py-1 rounded text-xs font-bold text-white ${
                                  opp.priority === "High" ? "bg-red-600" : 
                                  opp.priority === "Medium" ? "bg-orange-600" : 
                                  "bg-green-600"
                                }`}>
                                  {opp.priority}
                                </span>
                              </td>
                              <td className="border border-gray-300 p-3 text-center">{opp.estimatedValue ? `${opp.estimatedValue.toLocaleString()} SAR` : "-"}</td>
                              <td className="border border-gray-300 p-3 text-center">{opp.followUpDate ? new Date(opp.followUpDate).toLocaleDateString("ar-SA") : "-"}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Footer with Logo */}
                <div className="border-t-4 border-red-700 pt-8 mt-8 text-center">
                  <div className="flex justify-center mb-4">
                    <img src="/logos/convergent-datacenter.webp" alt="Convergent Data Center" className="h-12" />
                  </div>
                  <p className="text-gray-700 font-semibold mb-2">Convergent Technology</p>
                  <p className="text-gray-600 text-sm mb-1">Data Center Solutions & Assessment Services</p>
                  <p className="text-gray-600 text-sm mb-4">حلول مراكز البيانات وخدمات التقييم</p>
                  <div className="border-t border-gray-300 pt-4 mt-4">
                    <p className="text-gray-500 text-xs">
                      تم إنشاء هذا التقرير بواسطة نظام تقييم مراكز البيانات من Convergent Technology
                    </p>
                    <p className="text-gray-500 text-xs mt-1">
                      © 2025 Convergent Technology. All Rights Reserved.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

