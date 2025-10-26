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
const TOPOLOGIES = ["Standalone", "N+1", "N+2", "2N", "Redundant (N+x)", "أخرى"];
const STATUSES = ["Active", "Standby", "Shutdown", "Malfunction", "Needs Maintenance", "EOL"];

// Product-specific field configurations
const PRODUCT_FIELDS: Record<string, { label: string; placeholder: string }[]> = {
  "UPS": [
    { label: "السعة (kVA)", placeholder: "160 kVA" },
    { label: "نوع البطارية", placeholder: "Lead-Acid / Lithium" },
    { label: "مدة الاستقلالية (دقائق)", placeholder: "15" },
  ],
  "Precision Cooling": [
    { label: "النوع (DX/CW)", placeholder: "DX / CW" },
    { label: "السعة (kW)", placeholder: "50 kW" },
    { label: "طريقة التوزيع", placeholder: "In-Row / CRAC / CRAH" },
  ],
  "Racks": [
    { label: "الارتفاع (U)", placeholder: "42U" },
    { label: "العمق (mm)", placeholder: "1000" },
    { label: "الحمل الأقصى (kg)", placeholder: "1000" },
  ],
  "PDUs": [
    { label: "النوع", placeholder: "Basic / Metered / Switched" },
    { label: "الجهد (V)", placeholder: "230V" },
    { label: "عدد المخارج", placeholder: "24" },
  ],
  "Busway": [
    { label: "تصنيف التيار (A)", placeholder: "1000A" },
    { label: "الموقع", placeholder: "Floor / Overhead" },
    { label: "نقاط المراقبة", placeholder: "5" },
  ],
  "Aisle Containments": [
    { label: "النوع", placeholder: "Hot / Cold" },
    { label: "طريقة الإغلاق", placeholder: "Full / Partial" },
    { label: "الحالة", placeholder: "Good / Fair / Poor" },
  ],
  "Surveillance": [
    { label: "نوع النظام", placeholder: "IP / Analog" },
    { label: "عدد الكاميرات", placeholder: "16" },
    { label: "فترة الاحتفاظ (أيام)", placeholder: "30" },
  ],
  "Access Control": [
    { label: "نوع النظام", placeholder: "RFID / Biometric / Card" },
    { label: "عدد نقاط الوصول", placeholder: "8" },
    { label: "تكامل DCIM", placeholder: "نعم / لا" },
  ],
  "Fire Alarm": [
    { label: "نوع النظام", placeholder: "Addressable / Conventional" },
    { label: "عدد المكتشفات", placeholder: "32" },
    { label: "تاريخ الصيانة الأخيرة", placeholder: "2024-01-15" },
  ],
  "Fire Fighting": [
    { label: "نوع الوسيط", placeholder: "FM200 / Inergen / Water" },
    { label: "السعة (kg)", placeholder: "100" },
    { label: "تاريخ الفحص", placeholder: "2024-01-15" },
  ],
  "Electrical (LV Panels)": [
    { label: "تصنيف التيار (A)", placeholder: "1000A" },
    { label: "نوع القاطع", placeholder: "MCB / MCCB / ACB" },
    { label: "عدادات ذكية", placeholder: "نعم / لا" },
  ],
  "Diesel Generators": [
    { label: "السعة (kVA)", placeholder: "500 kVA" },
    { label: "وضع التشغيل", placeholder: "Prime / Standby" },
    { label: "استقلالية الوقود (ساعات)", placeholder: "8" },
  ],
};

export default function AssetsForm({ questionnaireId }: AssetsFormProps) {
  const [, navigate] = useLocation();
  const [assets, setAssets] = useState<any[]>([]);
  const [form, setForm] = useState({
    productType: "",
    contractor: "",
    manufacturer: "",
    model: "",
    technology: "",
    topology: "",
    manufacturingDate: "",
    startupDate: "",
    capacity: "",
    quantity: "",
    status: "",
    maintenanceNotes: "",
    customFields: {} as Record<string, string>,
  });

  const addAssetMutation = trpc.asset.add.useMutation({
    onSuccess: () => {
      toast.success("تم إضافة الأصل");
      setAssets([...assets, { ...form, id: Date.now() }]);
      setForm({
        productType: "",
        contractor: "",
        manufacturer: "",
        model: "",
        technology: "",
        topology: "",
        manufacturingDate: "",
        startupDate: "",
        capacity: "",
        quantity: "",
        status: "",
        maintenanceNotes: "",
        customFields: {},
      });
    },
    onError: (e) => toast.error(e.message),
  });

  const handleAdd = () => {
    if (!form.productType || !form.status) {
      toast.error("ملء الحقول المطلوبة");
      return;
    }
    addAssetMutation.mutate({
      questionnaireId,
      productType: form.productType as any,
      contractor: form.contractor || undefined,
      manufacturer: form.manufacturer || undefined,
      model: form.model || undefined,
      technology: form.technology || undefined,
      topology: (form.topology || undefined) as any,
      manufacturingDate: form.manufacturingDate || undefined,
      startupDate: form.startupDate || undefined,
      capacity: form.capacity || undefined,
      unitCount: form.quantity ? parseInt(form.quantity) : undefined,
      status: form.status as any,
      maintenanceNotes: form.maintenanceNotes || undefined,
      specificData: Object.keys(form.customFields).length > 0 ? form.customFields : undefined,
    });
  };

  const handleProductTypeChange = (value: string) => {
    setForm({
      ...form,
      productType: value,
      customFields: {}, // Reset custom fields when product type changes
    });
  };

  const handleCustomFieldChange = (fieldLabel: string, value: string) => {
    setForm({
      ...form,
      customFields: {
        ...form.customFields,
        [fieldLabel]: value,
      },
    });
  };

  const productSpecificFields = PRODUCT_FIELDS[form.productType] || [];

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

                {/* Common Fields */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label>نوع المنتج *</Label>
                    <Select value={form.productType} onValueChange={handleProductTypeChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="اختر" />
                      </SelectTrigger>
                      <SelectContent>
                        {PRODUCT_TYPES.map((t) => (
                          <SelectItem key={t} value={t}>
                            {t}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>المورد</Label>
                    <Input
                      value={form.contractor}
                      onChange={(e) => setForm({ ...form, contractor: e.target.value })}
                      placeholder="الشركة"
                    />
                  </div>
                  <div>
                    <Label>المصنع</Label>
                    <Input
                      value={form.manufacturer}
                      onChange={(e) => setForm({ ...form, manufacturer: e.target.value })}
                      placeholder="Schneider Electric"
                    />
                  </div>
                  <div>
                    <Label>الموديل</Label>
                    <Input
                      value={form.model}
                      onChange={(e) => setForm({ ...form, model: e.target.value })}
                      placeholder="رقم الموديل"
                    />
                  </div>
                  <div>
                    <Label>الطوبولوجيا</Label>
                    <Select value={form.topology} onValueChange={(v) => setForm({ ...form, topology: v })}>
                      <SelectTrigger>
                        <SelectValue placeholder="اختر" />
                      </SelectTrigger>
                      <SelectContent>
                        {TOPOLOGIES.map((t) => (
                          <SelectItem key={t} value={t}>
                            {t}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>تاريخ التصنيع</Label>
                    <Input
                      type="date"
                      value={form.manufacturingDate}
                      onChange={(e) => setForm({ ...form, manufacturingDate: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>تاريخ البدء</Label>
                    <Input
                      type="date"
                      value={form.startupDate}
                      onChange={(e) => setForm({ ...form, startupDate: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>الحالة *</Label>
                    <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}>
                      <SelectTrigger>
                        <SelectValue placeholder="اختر" />
                      </SelectTrigger>
                      <SelectContent>
                        {STATUSES.map((s) => (
                          <SelectItem key={s} value={s}>
                            {s}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>الكمية</Label>
                    <Input
                      type="number"
                      min="1"
                      value={form.quantity}
                      onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                      placeholder="1"
                    />
                  </div>
                </div>

                {/* Product-Specific Fields */}
                {productSpecificFields.length > 0 && (
                  <div className="mt-6 pt-6 border-t">
                    <h4 className="font-semibold mb-4 text-blue-600">معلومات خاصة بـ {form.productType}</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {productSpecificFields.map((field) => (
                        <div key={field.label}>
                          <Label>{field.label}</Label>
                          <Input
                            value={form.customFields[field.label] || ""}
                            onChange={(e) => handleCustomFieldChange(field.label, e.target.value)}
                            placeholder={field.placeholder}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <Label>ملاحظات</Label>
                  <Textarea
                    value={form.maintenanceNotes}
                    onChange={(e) => setForm({ ...form, maintenanceNotes: e.target.value })}
                    placeholder="وصف الحالة والفرص"
                    rows={2}
                  />
                </div>
                <Button
                  onClick={handleAdd}
                  disabled={addAssetMutation.isPending}
                  className="w-full bg-green-600"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  {addAssetMutation.isPending ? "جاري..." : "إضافة الأصل"}
                </Button>
              </div>

              {assets.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-4">الأصول المضافة ({assets.length})</h3>
                  <div className="space-y-2">
                    {assets.map((a) => (
                      <div key={a.id} className="p-4 border rounded-lg bg-white flex justify-between">
                        <div>
                          <p className="font-semibold">
                            {a.productType} - {a.model}
                          </p>
                          <p className="text-sm text-gray-600">
                            {a.manufacturer} | {a.status}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setAssets(assets.filter((x) => x.id !== a.id))}
                          className="text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-4 pt-6 border-t">
                <Button variant="outline" className="flex-1" onClick={() => navigate("/")}>
                  السابق
                </Button>
                <Button
                  onClick={() => navigate(`/opportunities/${questionnaireId}`)}
                  className="flex-1 bg-blue-600"
                  disabled={assets.length === 0}
                >
                  التالي: الفرص البيعية
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

