import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { Eye, Download, Trash2, Plus } from "lucide-react";
import { useLocation } from "wouter";

export default function QuestionnairesListPage() {
  const [, navigate] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");

  const questionnairesQuery = trpc.questionnaire.list.useQuery();
  const questionnaires = questionnairesQuery.data || [];

  const filteredQuestionnaires = questionnaires.filter(q =>
    q.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    q.dataCenterName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">الاستبيانات</h1>
            <Button onClick={() => navigate("/questionnaire/new")} className="bg-blue-600">
              <Plus className="mr-2 h-4 w-4" />
              استبيان جديد
            </Button>
          </div>

          <Input
            placeholder="ابحث عن عميل أو مركز بيانات..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>

        {questionnairesQuery.isLoading ? (
          <div className="text-center py-12">جاري التحميل...</div>
        ) : filteredQuestionnaires.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">لا توجد استبيانات</p>
            <Button onClick={() => navigate("/questionnaire/new")} className="bg-blue-600">
              إنشاء الأول
            </Button>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredQuestionnaires.map((q) => (
              <Card key={q.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">{q.clientName}</h3>
                      <p className="text-gray-600">{q.dataCenterName}</p>
                      <p className="text-sm text-gray-500 mt-2">
                        الموقع: {q.location} | التاريخ: {new Date(q.visitDate).toLocaleDateString("ar-SA")}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/report/${q.id}`)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toast.info("قريباً")}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
