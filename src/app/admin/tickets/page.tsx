"use client";

import { useState } from "react";
import {
  Plus,
  Trash2,
  Check,
  AlertCircle,
  Shield,
  Zap,
  Flame,
  AlertTriangle,
  Copy,
} from "lucide-react";

type TicketForm = {
  name: string;
  nameFr: string;
  bookingCode: string;
  totalOdds: string;
  riskLevel: string;
  isFree: boolean;
};

const EMPTY_TICKET: TicketForm = {
  name: "",
  nameFr: "",
  bookingCode: "",
  totalOdds: "",
  riskLevel: "safe",
  isFree: false,
};

const RISK_OPTIONS = [
  { value: "safe", label: "Safe / Sur", icon: Shield, color: "emerald" },
  { value: "medium", label: "Medium / Moyen", icon: Zap, color: "yellow" },
  { value: "high", label: "High / Eleve", icon: Flame, color: "orange" },
  { value: "extreme", label: "Extreme / Jackpot", icon: AlertTriangle, color: "red" },
];

export default function AdminTicketsPage() {
  const [tickets, setTickets] = useState<TicketForm[]>([
    { ...EMPTY_TICKET, name: "Safe Ticket", nameFr: "Ticket Sur", riskLevel: "safe", isFree: true },
    { ...EMPTY_TICKET, name: "Value Ticket", nameFr: "Ticket Value", riskLevel: "medium" },
    { ...EMPTY_TICKET, name: "Combo Ticket", nameFr: "Ticket Combine", riskLevel: "medium" },
    { ...EMPTY_TICKET, name: "High Risk Ticket", nameFr: "Ticket Risque", riskLevel: "high" },
    { ...EMPTY_TICKET, name: "Jackpot Ticket", nameFr: "Ticket Jackpot", riskLevel: "extreme" },
  ]);
  const [adminKey, setAdminKey] = useState("");
  const [status, setStatus] = useState<{
    type: "success" | "error" | "loading" | null;
    message: string;
  }>({ type: null, message: "" });

  const updateTicket = (index: number, field: keyof TicketForm, value: string | boolean) => {
    setTickets((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const addTicket = () => {
    setTickets((prev) => [...prev, { ...EMPTY_TICKET }]);
  };

  const removeTicket = (index: number) => {
    setTickets((prev) => prev.filter((_, i) => i !== index));
  };

  const submitAll = async () => {
    if (!adminKey) {
      setStatus({ type: "error", message: "Enter admin key first" });
      return;
    }

    setStatus({ type: "loading", message: "Saving tickets..." });

    try {
      const results = [];
      for (const ticket of tickets) {
        if (!ticket.bookingCode || !ticket.totalOdds) {
          results.push({ name: ticket.name, error: "Missing code or odds" });
          continue;
        }

        const res = await fetch("/api/tickets", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-admin-key": adminKey,
          },
          body: JSON.stringify(ticket),
        });

        if (!res.ok) {
          const err = await res.json();
          results.push({ name: ticket.name, error: err.error });
        } else {
          results.push({ name: ticket.name, success: true });
        }
      }

      const successes = results.filter((r) => "success" in r).length;
      const failures = results.filter((r) => "error" in r).length;

      if (failures > 0) {
        setStatus({
          type: "error",
          message: `${successes} saved, ${failures} failed. Check codes and odds.`,
        });
      } else {
        setStatus({
          type: "success",
          message: `All ${successes} tickets saved successfully!`,
        });
      }
    } catch {
      setStatus({ type: "error", message: "Network error. Try again." });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">
              Admin — Daily Ticket Codes
            </h1>
            <p className="text-sm text-gray-500">
              Enter today&apos;s 1xBet booking codes from your dedicated account
            </p>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="password"
              placeholder="Admin Key"
              value={adminKey}
              onChange={(e) => setAdminKey(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm w-40"
            />
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="max-w-5xl mx-auto px-4 py-6">
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
          <h3 className="font-semibold text-blue-900 mb-2">How to use:</h3>
          <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
            <li>Log into your dedicated 1xBet account</li>
            <li>Add your AI-selected picks to the bet slip</li>
            <li>Click &quot;Book a Bet&quot; to generate a booking code</li>
            <li>Paste the code below for each risk level</li>
            <li>Enter the total odds shown on 1xBet</li>
            <li>Click &quot;Save All Tickets&quot; — they go live on the website instantly</li>
          </ol>
        </div>

        {/* Status Message */}
        {status.type && (
          <div
            className={`rounded-xl p-4 mb-6 flex items-center gap-2 ${
              status.type === "success"
                ? "bg-emerald-50 border border-emerald-200 text-emerald-800"
                : status.type === "error"
                  ? "bg-red-50 border border-red-200 text-red-800"
                  : "bg-yellow-50 border border-yellow-200 text-yellow-800"
            }`}
          >
            {status.type === "success" ? (
              <Check className="w-5 h-5" />
            ) : (
              <AlertCircle className="w-5 h-5" />
            )}
            {status.message}
          </div>
        )}

        {/* Ticket Forms */}
        <div className="space-y-4">
          {tickets.map((ticket, index) => {
            const riskOption = RISK_OPTIONS.find((r) => r.value === ticket.riskLevel);
            const RiskIcon = riskOption?.icon || Shield;

            return (
              <div
                key={index}
                className="bg-white rounded-xl border border-gray-200 overflow-hidden"
              >
                {/* Ticket Header */}
                <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b">
                  <div className="flex items-center gap-2">
                    <RiskIcon className="w-5 h-5 text-gray-600" />
                    <span className="font-semibold text-gray-900">
                      Ticket #{index + 1}
                    </span>
                    {ticket.isFree && (
                      <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-2 py-0.5 rounded-full">
                        FREE
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => removeTicket(index)}
                    className="text-red-400 hover:text-red-600 p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Ticket Fields */}
                <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* Name EN */}
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">
                      Name (English)
                    </label>
                    <input
                      type="text"
                      value={ticket.name}
                      onChange={(e) => updateTicket(index, "name", e.target.value)}
                      placeholder="e.g. Safe Ticket"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    />
                  </div>

                  {/* Name FR */}
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">
                      Nom (Francais)
                    </label>
                    <input
                      type="text"
                      value={ticket.nameFr}
                      onChange={(e) => updateTicket(index, "nameFr", e.target.value)}
                      placeholder="ex. Ticket Sur"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    />
                  </div>

                  {/* Risk Level */}
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">
                      Risk Level
                    </label>
                    <select
                      value={ticket.riskLevel}
                      onChange={(e) =>
                        updateTicket(index, "riskLevel", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    >
                      {RISK_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Booking Code — THE KEY FIELD */}
                  <div className="md:col-span-2">
                    <label className="block text-xs text-gray-500 mb-1 font-semibold">
                      1xBet Booking Code ★
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={ticket.bookingCode}
                        onChange={(e) =>
                          updateTicket(
                            index,
                            "bookingCode",
                            e.target.value.toUpperCase().trim()
                          )
                        }
                        placeholder="e.g. XF7K2M9P"
                        className="flex-1 px-4 py-3 border-2 border-emerald-300 rounded-lg text-lg font-mono font-bold tracking-wider text-center focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none"
                      />
                      <button
                        onClick={async () => {
                          const text = await navigator.clipboard.readText();
                          updateTicket(index, "bookingCode", text.toUpperCase().trim());
                        }}
                        className="px-3 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 text-gray-600"
                        title="Paste from clipboard"
                      >
                        <Copy className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  {/* Total Odds */}
                  <div>
                    <label className="block text-xs text-gray-500 mb-1 font-semibold">
                      Total Odds ★
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={ticket.totalOdds}
                      onChange={(e) =>
                        updateTicket(index, "totalOdds", e.target.value)
                      }
                      placeholder="e.g. 4.85"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono"
                    />
                  </div>

                  {/* Free toggle */}
                  <div className="flex items-center gap-2 md:col-span-3">
                    <input
                      type="checkbox"
                      id={`free-${index}`}
                      checked={ticket.isFree}
                      onChange={(e) =>
                        updateTicket(index, "isFree", e.target.checked)
                      }
                      className="w-4 h-4 rounded border-gray-300 text-emerald-600"
                    />
                    <label
                      htmlFor={`free-${index}`}
                      className="text-sm text-gray-700"
                    >
                      This is the <strong>free daily ticket</strong> (visible
                      to all visitors)
                    </label>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Add + Save */}
        <div className="flex items-center justify-between mt-6">
          <button
            onClick={addTicket}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 text-sm font-medium text-gray-700"
          >
            <Plus className="w-4 h-4" />
            Add Ticket
          </button>

          <button
            onClick={submitAll}
            disabled={status.type === "loading"}
            className="flex items-center gap-2 px-8 py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-colors disabled:opacity-50"
          >
            {status.type === "loading" ? (
              "Saving..."
            ) : (
              <>
                <Check className="w-5 h-5" />
                Save All Tickets
              </>
            )}
          </button>
        </div>

        {/* Reminder */}
        <div className="mt-8 bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
          <p className="font-semibold mb-1">Daily Routine:</p>
          <ol className="list-decimal list-inside space-y-1">
            <li>Every morning, log into your 1xBet account</li>
            <li>Select today&apos;s best matches based on the AI predictions</li>
            <li>Create 5 bet slips (safe → extreme) and &quot;Book a Bet&quot; for each</li>
            <li>Paste the 5 booking codes here</li>
            <li>Mark the safest one as &quot;FREE&quot; so visitors can see it</li>
            <li>Click Save — codes go live on the website immediately</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
