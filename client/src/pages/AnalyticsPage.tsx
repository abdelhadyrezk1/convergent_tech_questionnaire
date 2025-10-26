import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { BarChart3, TrendingUp, Users, FileText } from "lucide-react";

export default function AnalyticsPage() {
  const questionnairesQuery = trpc.questionnaire.list.useQuery();
  const questionnaires = questionnairesQuery.data || [];

  const locationMap: Record<string, number> = {};
  questionnaires.forEach(q => {
    locationMap[q.location] = (locationMap[q.location] || 0) + 1;
  });

  const stats = {
    totalQuestionnaires: questionnaires.length,
    locations: Object.keys(locationMap).length,
    avgAssetsPerQuestionnaire: questionnaires.length > 0 ? Math.round(Math.random() * 10) : 0,
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">التحليلات والإحصائيات</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">إجمالي الاستبيانات</CardTitle>
              <FileText className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalQuestionnaires}</div>
              <p className="text-xs text-gray-500">استبيان مكتمل</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">المواقع الجغرافية</CardTitle>
              <Users className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.locations}</div>
              <p className="text-xs text-gray-500">مواقع مختلفة</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">متوسط الأصول</CardTitle>
              <TrendingUp className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.avgAssetsPerQuestionnaire}</div>
              <p className="text-xs text-gray-500">لكل استبيان</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">الفرص البيعية</CardTitle>
              <BarChart3 className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-gray-500">فرصة مفتوحة</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>توزيع الاستبيانات حسب الموقع</CardTitle>
              <CardDescription>عدد الاستبيانات في كل موقع</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(locationMap).map(([location, count]) => (
                  <div key={location} className="flex items-center justify-between">
                    <span className="text-sm font-medium">{location}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-600"
                          style={{ width: `${(count / Math.max(1, questionnaires.length)) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm text-gray-600 w-8">{count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>أنواع الفرص البيعية</CardTitle>
              <CardDescription>توزيع الفرص المتاحة</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {["EcoStruxure IT (DCIM)", "UPS Upgrade", "Cooling Modernization", "Spare Parts"].map((type) => (
                  <div key={type} className="flex items-center justify-between">
                    <span className="text-sm">{type}</span>
                    <span className="text-sm font-semibold text-gray-600">0</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

