import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, CheckCircle, BarChart3, FileText } from "lucide-react";
import { APP_LOGO, APP_TITLE, getLoginUrl } from "@/const";
import { useLocation } from "wouter";

export default function Home() {
  const { user, loading, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin h-8 w-8" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {APP_LOGO && <img src={APP_LOGO} alt="Logo" className="h-10 w-10" />}
              <h1 className="text-3xl font-bold text-gray-900">{APP_TITLE}</h1>
            </div>
            {isAuthenticated && (
              <div className="text-sm text-gray-600">
                مرحبا، {user?.name || "المستخدم"}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        {!isAuthenticated ? (
          // Not logged in
          <div className="text-center py-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              استبيان تقييم حلول مراكز البيانات
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              منصة شاملة لجمع بيانات مراكز البيانات وتحديد فرص البيع من Schneider Electric
            </p>
            <Button
              onClick={() => window.location.href = getLoginUrl()}
              size="lg"
              className="bg-blue-600 hover:bg-blue-700"
            >
              تسجيل الدخول للبدء
            </Button>
          </div>
        ) : (
          // Logged in
          <div className="space-y-8">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                مرحبا بك في Convergent Technology
              </h2>
              <p className="text-lg text-gray-600">
                اختر الخطوة التالية لبدء العمل
              </p>
            </div>

            {/* Feature Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* New Questionnaire */}
              <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate("/questionnaire/new")}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-blue-600" />
                    استبيان جديد
                  </CardTitle>
                  <CardDescription>
                    إنشاء استبيان تقييم جديد لعميل
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">
                    ابدأ بجمع معلومات جديدة عن مركز بيانات العميل والأصول والفرص البيعية
                  </p>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">
                    ابدأ الآن
                  </Button>
                </CardContent>
              </Card>

              {/* My Questionnaires */}
              <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate("/questionnaires")}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    استبياناتي
                  </CardTitle>
                  <CardDescription>
                    عرض الاستبيانات المحفوظة
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">
                    اعرض وحرر الاستبيانات التي أنشأتها سابقا
                  </p>
                  <Button variant="outline" className="w-full">
                    عرض القائمة
                  </Button>
                </CardContent>
              </Card>

              {/* Analytics & Reports */}
              <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate("/analytics")}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-purple-600" />
                    التحليلات
                  </CardTitle>
                  <CardDescription>
                    عرض الإحصائيات والتقارير
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">
                    اعرض ملخص الفرص البيعية والإحصائيات
                  </p>
                  <Button variant="outline" className="w-full">
                    عرض التحليلات
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                معلومات سريعة
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-gray-600">الاستبيانات المكتملة</p>
                  <p className="text-2xl font-bold text-blue-600">0</p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <p className="text-sm text-gray-600">الفرص البيعية</p>
                  <p className="text-2xl font-bold text-green-600">0</p>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg">
                  <p className="text-sm text-gray-600">العملاء المقيمين</p>
                  <p className="text-2xl font-bold text-purple-600">0</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

