"use client";

import { useState, useEffect } from "react";
import { Search, Phone, Mail, Calendar, Check, AlertCircle, Home, CalendarDays, Shield, Bell, FileText } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

export default function AdminUI({ appointments: initialAppointments }: { appointments: any[] }) {
  const [appointments, setAppointments] = useState(initialAppointments);
  const [search, setSearch] = useState("");
  const [isUpdating, setIsUpdating] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [prescriptionDialog, setPrescriptionDialog] = useState<{ open: boolean; appointmentId: string; currentPrescription: string }>({
    open: false,
    appointmentId: "",
    currentPrescription: "",
  });
  const [prescriptionText, setPrescriptionText] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  const filtered = appointments.filter((a) =>
    a.name?.toLowerCase().includes(search.toLowerCase())
  );

  const toggleStatus = async (id: string, currentStatus: boolean) => {
    setIsUpdating(id);
    const newStatus = !currentStatus;

    // Optimistic update
    setAppointments(prev =>
      prev.map(a => a.appointment_id === id ? { ...a, diagnosed: newStatus } : a)
    );

    try {
      const res = await fetch('/api/appointments', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ appointment_id: id, diagnosed: newStatus }),
      });

      if (!res.ok) {
        throw new Error('Failed to update');
      }
    } catch (error) {
      // Revert on failure
      setAppointments(prev =>
        prev.map(a => a.appointment_id === id ? { ...a, diagnosed: currentStatus } : a)
      );
      alert("Failed to update status. Please try again.");
    } finally {
      setIsUpdating(null);
    }
  };

  const openPrescriptionDialog = (appointmentId: string, currentPrescription: string) => {
    setPrescriptionDialog({ open: true, appointmentId, currentPrescription });
    setPrescriptionText(currentPrescription || "");
  };

  const savePrescription = async () => {
    const { appointmentId } = prescriptionDialog;

    try {
      const res = await fetch('/api/appointments', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ appointment_id: appointmentId, prescription: prescriptionText }),
      });

      if (!res.ok) {
        throw new Error('Failed to update prescription');
      }

      // Update local state
      setAppointments(prev =>
        prev.map(a => a.appointment_id === appointmentId ? { ...a, prescription: prescriptionText } : a)
      );

      setPrescriptionDialog({ open: false, appointmentId: "", currentPrescription: "" });
      alert("Prescription updated successfully!");
    } catch (error) {
      alert("Failed to update prescription. Please try again.");
    }
  };

  // Safe date formatting to avoid hydration mismatch
  const currentDate = mounted ? format(new Date(), 'd MMM yyyy') : '...';

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 dark:from-slate-900 dark:to-slate-800 p-4 md:p-8 font-sans pb-24 md:pb-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-white drop-shadow-sm">Admin</h1>
          <div className="p-2 bg-white/20 backdrop-blur-md rounded-full shadow-sm text-white hover:bg-white/30 transition-colors cursor-pointer">
            <Bell className="w-6 h-6" />
          </div>
        </div>

        {/* Search & Date Row */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl px-5 py-3 text-slate-600 font-medium text-sm flex items-center justify-center md:justify-start shadow-sm min-w-fit">
            Today • {currentDate}
          </div>
          <div className="relative flex-1">
            <Input
              placeholder="Search patients"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-5 pr-12 bg-white/80 backdrop-blur-sm border-none shadow-sm h-full py-3 rounded-xl text-md placeholder:text-slate-400 focus-visible:ring-0 focus-visible:bg-white transition-all"
            />
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          </div>
        </div>
      </div>

      {/* Empty State */}
      {appointments.length === 0 && (
        <div className="max-w-md mx-auto text-center p-8 bg-white/50 backdrop-blur-md rounded-2xl border border-dashed border-slate-300 text-slate-500 mt-12">
          <AlertCircle className="w-8 h-8 mx-auto mb-3 opacity-50" />
          <h2 className="text-lg font-semibold">No appointments found</h2>
          <p className="text-sm">Check connection or wait for patients.</p>
        </div>
      )}

      {/* Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filtered.map((a) => (
          <div
            key={a.appointment_id}
            className="group bg-white/90 backdrop-blur-xl border border-white/50 rounded-3xl p-5 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              {/* Card Header: Name & Status Badge */}
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-lg font-bold text-slate-800 leading-tight">{a.name}</h2>
                {a.diagnosed ? (
                  <div className="bg-green-500 text-white p-1 rounded-full shadow-sm">
                    <Check className="w-4 h-4" />
                  </div>
                ) : (
                  <Badge variant="secondary" className="bg-slate-200 text-slate-500 hover:bg-slate-300 rounded-lg px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase">
                    Pending
                  </Badge>
                )}
              </div>

              {/* Card Details */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3 text-sm text-slate-600">
                  <Phone className="w-4 h-4 text-slate-400" />
                  <span className="font-medium">{a.phone}</span>
                </div>

                {a.email && (
                  <div className="flex items-center gap-3 text-sm text-slate-600">
                    <Mail className="w-4 h-4 text-slate-400" />
                    <span className="truncate max-w-[180px]" title={a.email}>{a.email}</span>
                  </div>
                )}

                <div className="flex items-start gap-3 text-sm text-slate-600">
                  <Calendar className="w-4 h-4 text-slate-400 mt-0.5" />
                  <div>
                    <div className="font-semibold text-slate-800">{a.appointment_type}</div>
                    <div className="text-xs text-slate-500 mt-0.5" suppressHydrationWarning>
                      {mounted ? new Date(a.preferred_date).toLocaleDateString() : '...'}
                    </div>
                  </div>
                </div>

                {a.notes && (
                  <div className="mt-2 text-xs text-slate-400 italic">
                    Note: {a.notes}
                  </div>
                )}

                {a.prescription && (
                  <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <FileText className="w-3 h-3 text-blue-600" />
                      <span className="text-xs font-semibold text-blue-600">Prescription</span>
                    </div>
                    <p className="text-xs text-slate-600 line-clamp-2">{a.prescription}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="space-y-2">
              {/* Prescription Button */}
              <Button
                onClick={() => openPrescriptionDialog(a.appointment_id, a.prescription || "")}
                variant="outline"
                size="sm"
                className="w-full text-xs bg-blue-50 hover:bg-blue-100 border-blue-200 text-blue-700"
              >
                <FileText className="w-3 h-3 mr-2" />
                {a.prescription ? "Edit Prescription" : "Add Prescription"}
              </Button>

              {/* Toggle Diagnosed */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between bg-slate-50/80 -mx-5 px-5 py-4 rounded-b-3xl -mb-5">
                <span className="text-sm font-bold text-slate-700 flex items-center gap-2">
                  {a.diagnosed && <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center shadow-sm"><Check className="w-3.5 h-3.5" /></div>}
                  Mark Diagnosed
                </span>
                <Switch
                  checked={a.diagnosed}
                  onCheckedChange={() => toggleStatus(a.appointment_id, a.diagnosed)}
                  disabled={isUpdating === a.appointment_id}
                  className="data-[state=checked]:bg-green-500 border-2 border-slate-200 data-[state=checked]:border-green-600 h-6 w-11 shadow-inner"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Prescription Dialog */}
      <Dialog open={prescriptionDialog.open} onOpenChange={(open) => setPrescriptionDialog({ ...prescriptionDialog, open })}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              {prescriptionDialog.currentPrescription ? "Edit Prescription" : "Add Prescription"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="prescription" className="text-sm font-medium">
                Medicines & Doses
              </label>
              <Textarea
                id="prescription"
                placeholder="Enter medicines, dosages, and instructions...&#10;&#10;Example:&#10;1. Amoxicillin 500mg - 3 times daily for 7 days&#10;2. Ibuprofen 400mg - as needed for pain"
                value={prescriptionText}
                onChange={(e) => setPrescriptionText(e.target.value)}
                rows={8}
                className="resize-none"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPrescriptionDialog({ open: false, appointmentId: "", currentPrescription: "" })}>
              Cancel
            </Button>
            <Button onClick={savePrescription} className="bg-blue-600 hover:bg-blue-700">
              Save Prescription
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Mobile Nav (Visual Only) */}
      <div className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-xl border border-white/20 shadow-2xl rounded-full px-8 py-4 flex items-center gap-8 z-50">
        <div className="flex flex-col items-center gap-1 text-blue-600">
          <Home className="w-5 h-5" />
        </div>
        <div className="flex flex-col items-center gap-1 text-slate-400">
          <CalendarDays className="w-5 h-5" />
        </div>
        <div className="flex flex-col items-center gap-1 text-slate-400">
          <Shield className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
}
