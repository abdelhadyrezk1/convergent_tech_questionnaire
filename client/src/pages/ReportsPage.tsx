import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { FileText, Download, Eye, Trash2, Search, Printer } from "lucide-react";
import { BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { exportReportsToPDF, printReports } from "@/lib/pdfExport";
import { useState, useMemo } from "react";

export default function ReportsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("date");
  const [isExporting, setIsExporting] = useState(false);

  const handleExportPDF = async () => {
    try {
      setIsExporting(true);
      // Add a small delay to ensure DOM is ready
      setTimeout(() => {
        exportReportsToPDF(`convergent_technology_reports_${new Date().toISOString().split('T')[0]}.pdf`);
        toast.success("تم تصدير التقرير إلى PDF بنجاح");
      }, 100);
    } catch (error) {
      toast.error("فشل تصدير التقرير");
      console.error(error);
    } finally {
      setIsExporting(false);
    }
  };

  const handlePrint = () => {
    try {
      printReports();
      toast.success("تم فتح نافذة الطباعة");
    } catch (error) {
      toast.error("فشل فتح نافذة الطباعة");
      console.error(error);
    }
  };

  // Fetch all questionnaires (which contain reports)
  const { data: questionnaires = [], isLoading } = trpc.questionnaire.list.useQuery();

  // Filter and sort reports
  const filteredReports = useMemo(() => {
    let reports = questionnaires.map((q: any) => ({
      id: q.id,
      clientName: q.clientName,
      dataCenterName: q.dataCenterName,
      location: q.location,
      visitDate: new Date(q.visitDate),
      dcimHas: q.dcimHas,
      dcimNeeds: q.dcimNeeds,
      createdAt: new Date(q.createdAt),
    }));

    // Apply search filter
    if (searchTerm) {
      reports = reports.filter((r: any) =>
        r.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.dataCenterName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter (DCIM needs)
    if (statusFilter !== "all") {
      reports = reports.filter((r: any) => r.dcimNeeds === statusFilter);
    }

    // Apply sorting
    reports.sort((a: any, b: any) => {
      switch (sortBy) {
        case "date":
          return b.createdAt.getTime() - a.createdAt.getTime();
        case "client":
          return a.clientName.localeCompare(b.clientName);
        case "location":
          return a.location.localeCompare(b.location);
        default:
          return 0;
      }
    });

    return reports;
  }, [questionnaires, searchTerm, statusFilter, sortBy]);


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <FileText className="w-8 h-8 text-blue-600" />
              <h1 className="text-4xl font-bold text-gray-900">التقارير</h1>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleExportPDF}
                disabled={isExporting || filteredReports.length === 0}
                className="gap-2"
              >
                <Download className="w-4 h-4" />
                تصدير PDF
              </Button>
              <Button
                onClick={handlePrint}
                variant="outline"
                disabled={filteredReports.length === 0}
                className="gap-2"
              >
                <Printer className="w-4 h-4" />
                طباعة
              </Button>
            </div>
          </div>
          <p className="text-gray-600">عرض وإدارة جميع تقارير تقييم مراكز البيانات</p>
        </div>

        {/* Top 3 Follow-up Recommendations */}
        {filteredReports.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {/* Recommendation 1: DCIM Implementation */}
            <Card className="border-l-4 border-l-orange-500 bg-orange-50">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <span className="text-2xl font-bold text-orange-600">1</span>
                  تنفيذ DCIM
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-700 mb-3">
                  عدد العملاء الذين يحتاجون إلى DCIM:
                </p>
                <p className="text-2xl font-bold text-orange-600">
                  {filteredReports.filter((r: any) => r.dcimNeeds === "نعم").length}
                </p>
                <p className="text-xs text-gray-600 mt-2">
                  فرصة بيع عالية الأولوية
                </p>
              </CardContent>
            </Card>

            {/* Recommendation 2: DCIM Upgrade */}
            <Card className="border-l-4 border-l-blue-500 bg-blue-50">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <span className="text-2xl font-bold text-blue-600">2</span>
                  ترقية DCIM
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-700 mb-3">
                  عدد العملاء لديهم DCIM بالفعل:
                </p>
                <p className="text-2xl font-bold text-blue-600">
                  {filteredReports.filter((r: any) => r.dcimHas === "نعم").length}
                </p>
                <p className="text-xs text-gray-600 mt-2">
                  فرصة ترقية وتحسين الحل
                </p>
              </CardContent>
            </Card>

            {/* Recommendation 3: Infrastructure Assessment */}
            <Card className="border-l-4 border-l-green-500 bg-green-50">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <span className="text-2xl font-bold text-green-600">3</span>
                  تقييم البنية التحتية
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-700 mb-3">
                  إجمالي الأصول المسجلة:
                </p>
                <p className="text-2xl font-bold text-green-600">
                  {filteredReports.reduce((sum: number, r: any) => sum + (r.assets?.length || 0), 0)}
                </p>
                <p className="text-xs text-gray-600 mt-2">
                  فرصة توسيع الحلول الإضافية
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Filters Card */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>البحث والتصفية</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Search */}
              <div>
                <Label>البحث</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="ابحث عن العميل أو مركز البيانات"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Status Filter */}
              <div>
                <Label>حالة الحاجة إلى DCIM</Label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">الكل</SelectItem>
                    <SelectItem value="نعم">نعم - يحتاج DCIM</SelectItem>
                    <SelectItem value="لا">لا - لا يحتاج</SelectItem>
                    <SelectItem value="غير متأكد">غير متأكد</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Sort By */}
              <div>
                <Label>ترتيب حسب</Label>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="date">التاريخ (الأحدث أولاً)</SelectItem>
                    <SelectItem value="client">اسم العميل</SelectItem>
                    <SelectItem value="location">الموقع</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Results Count */}
              <div className="flex items-end">
                <div className="text-sm text-gray-600">
                  عدد النتائج: <span className="font-bold text-lg">{filteredReports.length}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Reports Container for PDF Export */}
        <div id="reports-container" className="space-y-6">
          {/* Reports Table */}
          <Card>
            <CardHeader>
              <CardTitle>قائمة التقارير</CardTitle>
              <CardDescription>
                {isLoading ? "جاري التحميل..." : `إجمالي: ${filteredReports.length} تقرير`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-8 text-gray-500">جاري تحميل التقارير...</div>
              ) : filteredReports.length === 0 ? (
                <div className="text-center py-8 text-gray-500">لا توجد تقارير تطابق معايير البحث</div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-right">رقم التقرير</TableHead>
                        <TableHead className="text-right">اسم العميل</TableHead>
                        <TableHead className="text-right">مركز البيانات</TableHead>
                        <TableHead className="text-right">الموقع</TableHead>
                        <TableHead className="text-right">تاريخ الزيارة</TableHead>
                        <TableHead className="text-right">DCIM موجود</TableHead>
                        <TableHead className="text-right">الحاجة إلى DCIM</TableHead>
                        <TableHead className="text-right">الإجراءات</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredReports.map((report: any) => (
                        <TableRow key={report.id} className="hover:bg-gray-50">
                          <TableCell className="font-medium">#{report.id}</TableCell>
                          <TableCell>{report.clientName}</TableCell>
                          <TableCell>{report.dataCenterName}</TableCell>
                          <TableCell>{report.location}</TableCell>
                          <TableCell>{report.visitDate.toLocaleDateString("ar-SA")}</TableCell>
                          <TableCell>
                            <span
                              className={`px-2 py-1 rounded text-xs font-semibold ${
                                report.dcimHas === "نعم"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {report.dcimHas}
                            </span>
                          </TableCell>
                          <TableCell>
                            <span
                              className={`px-2 py-1 rounded text-xs font-semibold ${
                                report.dcimNeeds === "نعم"
                                  ? "bg-orange-100 text-orange-800"
                                  : report.dcimNeeds === "لا"
                                    ? "bg-green-100 text-green-800"
                                    : "bg-yellow-100 text-yellow-800"
                              }`}
                            >
                              {report.dcimNeeds}
                            </span>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => window.location.href = `/report/${report.id}`}
                                className="gap-1"
                              >
                                <Eye className="w-4 h-4" />
                                عرض
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={handleExportPDF}
                                className="gap-1"
                              >
                                <Download className="w-4 h-4" />
                                PDF
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Charts Section */}
          {filteredReports.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* DCIM Status Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>حالة DCIM</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={[
                          {
                            name: "بها DCIM",
                            value: filteredReports.filter((r: any) => r.dcimHas === "نعم").length,
                          },
                          {
                            name: "بدون DCIM",
                            value: filteredReports.filter((r: any) => r.dcimHas === "لا").length,
                          },
                        ]}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, value }) => `${name}: ${value}`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        <Cell fill="#10b981" />
                        <Cell fill="#ef4444" />
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* DCIM Needs Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>الحاجة إلى DCIM</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart
                      data={[
                        {
                          name: "نعم",
                          value: filteredReports.filter((r: any) => r.dcimNeeds === "نعم").length,
                        },
                        {
                          name: "لا",
                          value: filteredReports.filter((r: any) => r.dcimNeeds === "لا").length,
                        },
                        {
                          name: "غير متأكد",
                          value: filteredReports.filter((r: any) => r.dcimNeeds === "غير متأكد").length,
                        },
                      ]}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="value" fill="#f97316" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Reports by Location */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>التقارير حسب الموقع</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart
                      data={Array.from(
                        new Map(
                          filteredReports.map((r: any) => [
                            r.location,
                            (filteredReports.filter((rep: any) => rep.location === r.location).length),
                          ])
                        ),
                        ([location, count]) => ({ location, count })
                      )}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="location" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" fill="#3b82f6" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Asset Status Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle>توزيع الأصول حسب الحالة</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={[
                          {
                            name: "نشط",
                            value: filteredReports.reduce((sum: number, r: any) => sum + (r.assets?.filter((a: any) => a.status === "Active").length || 0), 0),
                          },
                          {
                            name: "غير نشط",
                            value: filteredReports.reduce((sum: number, r: any) => sum + (r.assets?.filter((a: any) => a.status === "Inactive").length || 0), 0),
                          },
                          {
                            name: "تحت الصيانة",
                            value: filteredReports.reduce((sum: number, r: any) => sum + (r.assets?.filter((a: any) => a.status === "Under Maintenance").length || 0), 0),
                          },
                        ]}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, value }) => `${name}: ${value}`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        <Cell fill="#10b981" />
                        <Cell fill="#ef4444" />
                        <Cell fill="#f59e0b" />
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Assets by Product Type */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>عدد الأصول حسب نوع المنتج</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart
                      data={[
                        { name: "UPS", count: 0 },
                        { name: "Cooling", count: 0 },
                        { name: "Racks", count: 0 },
                        { name: "PDUs", count: 0 },
                        { name: "Busway", count: 0 },
                        { name: "Aisle Containments", count: 0 },
                        { name: "DCIM", count: 0 },
                        { name: "Surveillance", count: 0 },
                        { name: "Access Control", count: 0 },
                        { name: "Fire Alarm", count: 0 },
                        { name: "Fire Fighting", count: 0 },
                        { name: "Electrical", count: 0 },
                        { name: "Generators", count: 0 },
                      ]}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" fill="#8b5cf6" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Summary Stats */}
          {filteredReports.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">
                      {filteredReports.filter((r: any) => r.dcimHas === "نعم").length}
                    </div>
                    <p className="text-sm text-gray-600 mt-2">بها DCIM</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-orange-600">
                      {filteredReports.filter((r: any) => r.dcimNeeds === "نعم").length}
                    </div>
                    <p className="text-sm text-gray-600 mt-2">تحتاج DCIM</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">
                      {filteredReports.filter((r: any) => r.dcimNeeds === "لا").length}
                    </div>
                    <p className="text-sm text-gray-600 mt-2">لا تحتاج DCIM</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-yellow-600">
                      {filteredReports.filter((r: any) => r.dcimNeeds === "غير متأكد").length}
                    </div>
                    <p className="text-sm text-gray-600 mt-2">غير متأكدة</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

