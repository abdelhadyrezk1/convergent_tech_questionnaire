import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { FileText, Download, Eye, Trash2, Search } from "lucide-react";

export default function ReportsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("date");

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

  const handleExportPDF = (reportId: number) => {
    toast.success(`تم تصدير التقرير رقم ${reportId} إلى PDF`);
    // TODO: Implement PDF export
  };

  const handleExportExcel = (reportId: number) => {
    toast.success(`تم تصدير التقرير رقم ${reportId} إلى Excel`);
    // TODO: Implement Excel export
  };

  const handleDelete = (reportId: number) => {
    toast.success(`تم حذف التقرير رقم ${reportId}`);
    // TODO: Implement delete functionality
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <FileText className="w-8 h-8 text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-900">التقارير</h1>
          </div>
          <p className="text-gray-600">عرض وإدارة جميع تقارير تقييم مراكز البيانات</p>
        </div>

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
                              onClick={() => handleExportPDF(report.id)}
                              className="gap-1"
                            >
                              <Download className="w-4 h-4" />
                              PDF
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleExportExcel(report.id)}
                              className="gap-1"
                            >
                              <Download className="w-4 h-4" />
                              Excel
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleDelete(report.id)}
                              className="gap-1"
                            >
                              <Trash2 className="w-4 h-4" />
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

        {/* Summary Stats */}
        {filteredReports.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
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
  );
}

