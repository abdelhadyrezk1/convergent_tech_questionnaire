import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { Plus, Trash2 } from "lucide-react";
import { useLocation } from "wouter";

interface AssetsFormProps {
  questionnaireId: number;
}

const PRODUCT_TYPES = ["UPS", "Precision Cooling", "Racks", "PDUs", "Busway", "Aisle Containments", "Surveillance", "Access Control", "Fire Alarm", "Fire Fighting", "Electrical (LV Panels)", "Diesel Generators"];
const TOPOLOGIES = ["Standalone", "N+1", "N+2", "2N", "Redundant (N+x)", "غير محدد"];
const STATUSES = ["Active", "Standby", "Shutdown", "Malfunction", "Needs Maintenance", "EOL"];

export default function AssetsForm({ questionnaireId }: AssetsFormProps) {
  const [, navigate] = useLocation();
  const [assets, setAssets] = useState<any[]>([]);
  const [form, setForm] = useState({
    productType: "", contractor: "", manufacturer: "", model: "", technology: "",
    topology: "", manufacturingDate: "", startupDate: "", capacity: "", status: "", maintenanceNotes: ""
  });

  const addAssetMutation = trpc.asset.add.useMutation({
    onSuccess: () => {
      toast.success("تم إضافة الأصل");
      setAssets([...assets, { ...form, id: Date.now() }]);
      setForm({ productType: "", contractor: "", manufacturer: "", model: "", technology: "", topology: "", manufacturingDate: "", startupDate: "", capacity: "", status: "", maintenanceNotes: "" });
    },
    onError: (e) => toast.error(e.message),
  });

  const handleAdd = () => {
    if (!form.productType || !form.status) { toast.error("ملء الحقول المطلوبة"); return; }
    addAssetMutation.mutate({ questionnaireId, ...form } as any);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>تقييم الأصول</CardTitle>
            <CardDescription>أضف معلومات الأصول والمعدات</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              <div className="space-y-4 p-4 bg-gray-100 rounded-lg">
                <h3 className="text-lg font-semibold">إضافة أصل جديد</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div><Label>نوع المنتج *</Label><Select value={form.productType} onValueChange={(v) => setForm({...form, productType: v})}><SelectTrigger><SelectValue placeholder="اختر" /></SelectTrigger><SelectContent>{PRODUCT_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent></Select></div>
                  <div><Label>المورد</Label><Input value={form.contractor} onChange={(e) => setForm({...form, contractor: e.target.value})} placeholder="الشركة" /></div>
                  <div><Label>المصنع</Label><Input value={form.manufacturer} onChange={(e) => setForm({...form, manufacturer: e.target.value})} placeholder="Schneider Electric" /></div>
                  <div><Label>الموديل</Label><Input value={form.model} onChange={(e) => setForm({...form, model: e.target.value})} placeholder="رقم الموديل" /></div>
                  <div><Label>التقنية</Label><Input value={form.technology} onChange={(e) => setForm({...form, technology: e.target.value})} placeholder="Double Conversion" /></div>
                  <div><Label>الطوبولوجيا</Label><Select value={form.topology} onValueChange={(v) => setForm({...form, topology: v})}><SelectTrigger><SelectValue placeholder="اختر" /></SelectTrigger><SelectContent>{TOPOLOGIES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent></Select></div>
                  <div><Label>تاريخ التصنيع</Label><Input type="date" value={form.manufacturingDate} onChange={(e) => setForm({...form, manufacturingDate: e.target.value})} /></div>
                  <div><Label>تاريخ البدء</Label><Input type="date" value={form.startupDate} onChange={(e) => setForm({...form, startupDate: e.target.value})} /></div>
                  <div><Label>السعة</Label><Input value={form.capacity} onChange={(e) => setForm({...form, capacity: e.target.value})} placeholder="160 kVA" /></div>
                  <div><Label>الحالة *</Label><Select value={form.status} onValueChange={(v) => setForm({...form, status: v})}><SelectTrigger><SelectValue placeholder="اختر" /></SelectTrigger><SelectContent>{STATUSES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent></Select></div>
                </div>
                <div><Label>ملاحظات</Label><Textarea value={form.maintenanceNotes} onChange={(e) => setForm({...form, maintenanceNotes: e.target.value})} placeholder="وصف الحالة والفرص" rows={2} /></div>
                <Button onClick={handleAdd} disabled={addAssetMutation.isPending} className="w-full bg-green-600"><Plus className="mr-2 h-4 w-4" />{addAssetMutation.isPending ? "جاري..." : "إضافة الأصل"}</Button>
              </div>

              {assets.length > 0 && (
                <div><h3 className="text-lg font-semibold mb-4">الأصول المضافة ({assets.length})</h3>
                <div className="space-y-2">
                  {assets.map((a) => (
                    <div key={a.id} className="p-4 border rounded-lg bg-white flex justify-between">
                      <div><p className="font-semibold">{a.productType} - {a.model}</p><p className="text-sm text-gray-600">{a.manufacturer} | {a.status}</p></div>
                      <Button variant="ghost" size="sm" onClick={() => setAssets(assets.filter(x => x.id !== a.id))} className="text-red-600"><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  ))}
                </div>
                </div>
              )}

              <div className="flex gap-4 pt-6 border-t">
                <Button variant="outline" className="flex-1" onClick={() => navigate("/")}>السابق</Button>
                <Button onClick={() => navigate(`/opportunities/${questionnaireId}`)} className="flex-1 bg-blue-600" disabled={assets.length === 0}>التالي: الفرص البيعية</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

