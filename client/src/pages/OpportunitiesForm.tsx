import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { Plus, Download } from "lucide-react";
import { useLocation } from "wouter";

const OPPORTUNITY_TYPES = ["Spare Parts Offer", "Maintenance Contract", "UPS Upgrade", "Cooling Modernization", "EcoStruxure IT (DCIM)", "Racks/Containment Expansion", "Electrical System Upgrade", "Fire/Security System Upgrade", "Other"];
const PRIORITIES = ["High", "Medium", "Low"];

export default function OpportunitiesForm({ questionnaireId }: { questionnaireId: number }) {
  const [, navigate] = useLocation();
  const [opportunities, setOpportunities] = useState<any[]>([]);
  const [form, setForm] = useState({ opportunityType: "", description: "", priority: "Medium", estimatedValue: "", followUpDate: "" });

  const addOpportunityMutation = trpc.opportunity.add.useMutation({
    onSuccess: () => {
      toast.success("تم إضافة الفرصة");
      setOpportunities([...opportunities, { ...form, id: Date.now() }]);
      setForm({ opportunityType: "", description: "", priority: "Medium", estimatedValue: "", followUpDate: "" });
    },
    onError: (e) => toast.error(e.message),
  });

  const handleAdd = () => {
    if (!form.opportunityType) { toast.error("اختر نوع الفرصة"); return; }
    addOpportunityMutation.mutate({
      questionnaireId,
      opportunityType: form.opportunityType as any,
      description: form.description,
      priority: form.priority as any,
      estimatedValue: form.estimatedValue ? parseInt(form.estimatedValue) : undefined,
      followUpDate: form.followUpDate ? new Date(form.followUpDate) : undefined,
    });
  };

  const handleGenerateReport = () => {
    toast.success("جاري إنشاء التقرير...");
    navigate(`/report/${questionnaireId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>الفرص البيعية</CardTitle>
            <CardDescription>حدد الفرص المتاحة لزيادة الإيرادات</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              <div className="space-y-4 p-4 bg-gray-100 rounded-lg">
                <h3 className="text-lg font-semibold">إضافة فرصة جديدة</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div><Label>نوع الفرصة *</Label><Select value={form.opportunityType} onValueChange={(v) => setForm({...form, opportunityType: v})}><SelectTrigger><SelectValue placeholder="اختر" /></SelectTrigger><SelectContent>{OPPORTUNITY_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent></Select></div>
                  <div><Label>الأولوية</Label><Select value={form.priority} onValueChange={(v) => setForm({...form, priority: v})}><SelectTrigger><SelectValue placeholder="اختر" /></SelectTrigger><SelectContent>{PRIORITIES.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent></Select></div>
                  <div><Label>القيمة المتوقعة (SAR)</Label><Input type="number" value={form.estimatedValue} onChange={(e) => setForm({...form, estimatedValue: e.target.value})} placeholder="0" /></div>
                  <div><Label>تاريخ المتابعة</Label><Input type="date" value={form.followUpDate} onChange={(e) => setForm({...form, followUpDate: e.target.value})} /></div>
                </div>
                <div><Label>الوصف</Label><Textarea value={form.description} onChange={(e) => setForm({...form, description: e.target.value})} placeholder="وصف الفرصة والتفاصيل..." rows={3} /></div>
                <Button onClick={handleAdd} disabled={addOpportunityMutation.isPending} className="w-full bg-green-600"><Plus className="mr-2 h-4 w-4" />{addOpportunityMutation.isPending ? "جاري..." : "إضافة الفرصة"}</Button>
              </div>

              {opportunities.length > 0 && (
                <div><h3 className="text-lg font-semibold mb-4">الفرص المضافة ({opportunities.length})</h3>
                <div className="space-y-2">
                  {opportunities.map((o) => (
                    <div key={o.id} className="p-4 border rounded-lg bg-white">
                      <p className="font-semibold">{o.opportunityType}</p>
                      <p className="text-sm text-gray-600">{o.description}</p>
                      <p className="text-sm mt-2">الأولوية: <span className={`font-semibold ${o.priority === "High" ? "text-red-600" : o.priority === "Medium" ? "text-yellow-600" : "text-green-600"}`}>{o.priority}</span></p>
                    </div>
                  ))}
                </div>
                </div>
              )}

              <div className="flex gap-4 pt-6 border-t">
                <Button variant="outline" className="flex-1" onClick={() => navigate("/")}>السابق</Button>
                <Button onClick={handleGenerateReport} className="flex-1 bg-blue-600"><Download className="mr-2 h-4 w-4" />إنشاء التقرير</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
