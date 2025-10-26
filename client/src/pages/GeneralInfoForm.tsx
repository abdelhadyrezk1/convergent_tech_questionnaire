import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";

interface GeneralInfoFormProps {
  onSuccess?: (questionnaireId: number) => void;
}

export default function GeneralInfoForm({ onSuccess }: GeneralInfoFormProps) {
  const [, navigate] = useLocation();
  const [formData, setFormData] = useState({
    clientName: "",
    dataCenterName: "",
    location: "" as "الرياض" | "جدة" | "الخبر" | "أخرى في KSA" | "",
    address: "",
    contactName: "",
    contactPhone: "",
    contactEmail: "",
    dataCenterStartDate: "",
    visitDate: new Date().toISOString().split("T")[0],
    dcimHas: "" as "نعم" | "لا" | "",
    dcimSystemName: "",
    dcimFeatures: [] as string[],
    dcimNeeds: "" as "نعم" | "لا" | "غير متأكد" | "",
    currentChallenges: "",
  });

  const createQuestionnaire = trpc.questionnaire.create.useMutation({
    onSuccess: (data) => {
      toast.success("تم حفظ المعلومات العامة بنجاح");
      onSuccess?.(data.id); navigate(`/assets/${data.id}`);
    },
    onError: (error) => {
      toast.error(`خطأ: ${error.message}`);
    },
  });

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.clientName || !formData.dataCenterName || !formData.location) {
      toast.error("يرجى ملء جميع الحقول المطلوبة");
      return;
    }

    createQuestionnaire.mutate({
      clientName: formData.clientName,
      dataCenterName: formData.dataCenterName,
      location: formData.location,
      address: formData.address,
      contactName: formData.contactName,
      contactPhone: formData.contactPhone,
      contactEmail: formData.contactEmail,
      dataCenterStartDate: formData.dataCenterStartDate ? parseInt(formData.dataCenterStartDate) : undefined,
      visitDate: new Date(formData.visitDate),
      dcimHas: formData.dcimHas as "نعم" | "لا",
      dcimSystemName: formData.dcimSystemName,
      dcimFeatures: formData.dcimFeatures,
      dcimNeeds: formData.dcimNeeds as "نعم" | "لا" | "غير متأكد",
      currentChallenges: formData.currentChallenges,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>استبيان تقييم حلول مراكز البيانات</CardTitle>
            <CardDescription>Convergent Technology - معلومات عامة عن مركز البيانات</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Section 1: General Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">1. معلومات عامة</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="clientName">اسم العميل / الجهة *</Label>
                    <Input
                      id="clientName"
                      value={formData.clientName}
                      onChange={(e) => handleInputChange("clientName", e.target.value)}
                      placeholder="مثال: شركة النخبة للاتصالات"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dataCenterName">اسم مركز البيانات *</Label>
                    <Input
                      id="dataCenterName"
                      value={formData.dataCenterName}
                      onChange={(e) => handleInputChange("dataCenterName", e.target.value)}
                      placeholder="مثال: مركز البيانات الرئيسي"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location">الموقع الجغرافي *</Label>
                    <Select value={formData.location} onValueChange={(value) => handleInputChange("location", value)}>
                      <SelectTrigger id="location">
                        <SelectValue placeholder="اختر الموقع" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="الرياض">الرياض</SelectItem>
                        <SelectItem value="جدة">جدة</SelectItem>
                        <SelectItem value="الخبر">الخبر</SelectItem>
                        <SelectItem value="أخرى في KSA">أخرى في KSA</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">العنوان التفصيلي</Label>
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={(e) => handleInputChange("address", e.target.value)}
                      placeholder="العنوان الكامل"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contactName">اسم جهة الاتصال</Label>
                    <Input
                      id="contactName"
                      value={formData.contactName}
                      onChange={(e) => handleInputChange("contactName", e.target.value)}
                      placeholder="اسم الشخص المسؤول"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contactPhone">رقم الهاتف</Label>
                    <Input
                      id="contactPhone"
                      type="tel"
                      value={formData.contactPhone}
                      onChange={(e) => handleInputChange("contactPhone", e.target.value)}
                      placeholder="+966 5X XXX XXXX"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contactEmail">البريد الإلكتروني</Label>
                    <Input
                      id="contactEmail"
                      type="email"
                      value={formData.contactEmail}
                      onChange={(e) => handleInputChange("contactEmail", e.target.value)}
                      placeholder="example@company.com"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dataCenterStartDate">تاريخ بدء تشغيل مركز البيانات (تقريبي)</Label>
                    <Input
                      id="dataCenterStartDate"
                      type="number"
                      min="2010"
                      max={new Date().getFullYear()}
                      value={formData.dataCenterStartDate}
                      onChange={(e) => handleInputChange("dataCenterStartDate", e.target.value)}
                      placeholder="2012"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="visitDate">تاريخ الزيارة *</Label>
                    <Input
                      id="visitDate"
                      type="date"
                      value={formData.visitDate}
                      onChange={(e) => handleInputChange("visitDate", e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: DCIM Assessment */}
              <div className="space-y-4 border-t pt-6">
                <h3 className="text-lg font-semibold">2. تقييم نظام DCIM (إدارة البنية التحتية)</h3>

                <div className="space-y-2">
                  <Label htmlFor="dcimHas">هل يوجد نظام DCIM حالي في الموقع؟ *</Label>
                  <Select value={formData.dcimHas} onValueChange={(value) => handleInputChange("dcimHas", value)}>
                    <SelectTrigger id="dcimHas">
                      <SelectValue placeholder="اختر الإجابة" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="نعم">نعم</SelectItem>
                      <SelectItem value="لا">لا</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {formData.dcimHas === "نعم" && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="dcimSystemName">اسم/موديل نظام DCIM الحالي</Label>
                      <Input
                        id="dcimSystemName"
                        value={formData.dcimSystemName}
                        onChange={(e) => handleInputChange("dcimSystemName", e.target.value)}
                        placeholder="مثال: Schneider Electric EcoStruxure IT"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>الميزات المستخدمة حاليًا</Label>
                      <div className="space-y-2">
                        {["Monitoring", "Asset Management", "Capacity Planning", "Energy Management"].map((feature) => (
                          <label key={feature} className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              checked={formData.dcimFeatures.includes(feature)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  handleInputChange("dcimFeatures", [...formData.dcimFeatures, feature]);
                                } else {
                                  handleInputChange(
                                    "dcimFeatures",
                                    formData.dcimFeatures.filter((f) => f !== feature)
                                  );
                                }
                              }}
                            />
                            <span>{feature}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="currentChallenges">التحديات الحالية في إدارة البنية التحتية</Label>
                      <Textarea
                        id="currentChallenges"
                        value={formData.currentChallenges}
                        onChange={(e) => handleInputChange("currentChallenges", e.target.value)}
                        placeholder="وصف التحديات التي تواجهها في استخدام النظام الحالي..."
                        rows={4}
                      />
                    </div>
                  </>
                )}

                <div className="space-y-2">
                  <Label htmlFor="dcimNeeds">هل يحتاج العميل إلى DCIM لمراقبة وإدارة مركز البيانات؟ *</Label>
                  <Select value={formData.dcimNeeds} onValueChange={(value) => handleInputChange("dcimNeeds", value)}>
                    <SelectTrigger id="dcimNeeds">
                      <SelectValue placeholder="اختر الإجابة" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="نعم">نعم</SelectItem>
                      <SelectItem value="لا">لا</SelectItem>
                      <SelectItem value="غير متأكد">غير متأكد</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex gap-4 pt-6 border-t">
                <Button
                  type="submit"
                  disabled={createQuestionnaire.isPending}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {createQuestionnaire.isPending ? "جاري الحفظ..." : "التالي: تقييم الأصول"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

