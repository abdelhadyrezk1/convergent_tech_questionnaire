import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, CheckCircle, BarChart3, FileText, TrendingUp } from "lucide-react";
import { APP_LOGO, APP_TITLE, getLoginUrl } from "@/const";
import { useLocation } from "wouter";

export default function Home() {
  const { user, loading, isAuthenticated, logout } = useAuth();
  const [, navigate] = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin h-8 w-8" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-slate-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-red-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/logos/convergent-technology.webp" alt="Convergent Technology" className="h-10 w-auto" />
            <div>
              <h1 className="text-2xl font-bold text-red-700">Convergent Technology</h1>
              <p className="text-sm text-gray-600">Data Center Assessment Questionnaire</p>
            </div>
          </div>
          {isAuthenticated && (
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-700">مرحبا، {user?.name}</span>
              <button
                onClick={logout}
                className="px-4 py-2 bg-red-700 text-white rounded-lg hover:bg-red-800 transition"
              >
                تسجيل الخروج
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8 w-full">
        {!isAuthenticated ? (
          // Not logged in
          <div className="text-center py-12">
            <h2 className="text-4xl font-bold text-red-700 mb-4">
              استبيان تقييم حلول مراكز البيانات
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              منصة شاملة لجمع بيانات مراكز البيانات وتحديد فرص البيع من Schneider Electric
            </p>
            <Button
              size="lg"
              onClick={() => window.location.href = getLoginUrl()}
              className="bg-red-700 hover:bg-red-800 text-white"
            >
              تسجيل الدخول
            </Button>
          </div>
        ) : (
          // Logged in
          <div>
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-red-700 mb-4">
                مرحبا بك في Convergent Technology
              </h2>
              <p className="text-xl text-gray-600">اختر الخطوة التالية لبدء العمل</p>
            </div>

            {/* Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {/* New Questionnaire Card */}
              <Card
                className="cursor-pointer hover:shadow-xl transition border-l-4 border-red-700"
                onClick={() => navigate("/general-info")}
              >
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <FileText className="text-red-700" size={28} />
                    <CardTitle>استبيان جديد</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    إنشاء استبيان تقييم جديد لعميل
                  </CardDescription>
                  <p className="text-sm text-gray-500 mt-2">
                    ابدأ بجمع معلومات جديدة عن مركز بيانات العميل والفرص للبيعة والأصول
                  </p>
                  <Button className="w-full mt-4 bg-red-700 hover:bg-red-800">
                    ابدأ الآن
                  </Button>
                </CardContent>
              </Card>

              {/* Questionnaires List Card */}
              <Card
                className="cursor-pointer hover:shadow-xl transition border-l-4 border-green-600"
                onClick={() => navigate("/questionnaires")}
              >
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="text-green-600" size={28} />
                    <CardTitle>الاستبيانات</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    عرض الاستبيانات المحفوظة
                  </CardDescription>
                  <p className="text-sm text-gray-500 mt-2">
                    اعرض ودير الاستبيانات التي أنشأتها سابقا
                  </p>
                  <Button className="w-full mt-4 bg-green-600 hover:bg-green-700">
                    عرض القائمة
                  </Button>
                </CardContent>
              </Card>

              {/* Reports Card */}
              <Card
                className="cursor-pointer hover:shadow-xl transition border-l-4 border-blue-600"
                onClick={() => navigate("/reports")}
              >
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <BarChart3 className="text-blue-600" size={28} />
                    <CardTitle>التقارير</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    عرض وإدارة التقارير
                  </CardDescription>
                  <p className="text-sm text-gray-500 mt-2">
                    اعرض جميع التقارير مع خيارات البحث والتصدير
                  </p>
                  <Button className="w-full mt-4 bg-blue-600 hover:bg-blue-700">
                    عرض التقارير
                  </Button>
                </CardContent>
              </Card>

              {/* Analytics Card */}
              <Card
                className="cursor-pointer hover:shadow-xl transition border-l-4 border-purple-600"
                onClick={() => navigate("/analytics")}
              >
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <TrendingUp className="text-purple-600" size={28} />
                    <CardTitle>التحليلات</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    عرض الإحصائيات والتحليلات
                  </CardDescription>
                  <p className="text-sm text-gray-500 mt-2">
                    اعرض ملخص الفرص البيعية والإحصائيات
                  </p>
                  <Button className="w-full mt-4 bg-purple-600 hover:bg-purple-700">
                    عرض التحليلات
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle>معلومات سريعة</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-6">
                    <p className="text-gray-600 text-sm mb-2">الاستبيانات المكتملة</p>
                    <p className="text-4xl font-bold text-red-700">0</p>
                  </div>
                  <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6">
                    <p className="text-gray-600 text-sm mb-2">الفرص البيعية</p>
                    <p className="text-4xl font-bold text-green-700">0</p>
                  </div>
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6">
                    <p className="text-gray-600 text-sm mb-2">العملاء المقيمين</p>
                    <p className="text-4xl font-bold text-blue-700">0</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-red-200 shadow-sm mt-auto">
        <div className="max-w-7xl mx-auto px-4 py-6 flex items-center justify-between">
          <img src="/logos/convergent-datacenter.webp" alt="Convergent Data Center" className="h-8 w-auto" />
          <p className="text-sm text-gray-600">© 2025 Convergent Technology. جميع الحقوق محفوظة.</p>
        </div>
      </footer>
    </div>
  );
}
