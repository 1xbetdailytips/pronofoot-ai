import Link from "next/link";
import { ArrowLeft, Search, TrendingUp, BarChart3, FileText } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center max-w-lg">
        <p className="text-8xl font-extrabold text-emerald-600 mb-4">404</p>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Page introuvable</h1>
        <p className="text-gray-500 mb-8">
          Cette page n&apos;existe pas ou a ete deplacee. Essayez l&apos;un de ces liens :
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
          <Link href="/fr/predictions" className="flex items-center gap-3 bg-white border border-gray-200 rounded-xl px-4 py-3 hover:border-emerald-300 hover:bg-emerald-50 transition-colors">
            <TrendingUp className="w-5 h-5 text-emerald-600" />
            <div className="text-left">
              <p className="font-semibold text-gray-900 text-sm">Pronostics</p>
              <p className="text-xs text-gray-500">Predictions du jour</p>
            </div>
          </Link>
          <Link href="/fr/stats" className="flex items-center gap-3 bg-white border border-gray-200 rounded-xl px-4 py-3 hover:border-blue-300 hover:bg-blue-50 transition-colors">
            <BarChart3 className="w-5 h-5 text-blue-600" />
            <div className="text-left">
              <p className="font-semibold text-gray-900 text-sm">Statistiques</p>
              <p className="text-xs text-gray-500">Performance de l&apos;IA</p>
            </div>
          </Link>
          <Link href="/fr/blog" className="flex items-center gap-3 bg-white border border-gray-200 rounded-xl px-4 py-3 hover:border-purple-300 hover:bg-purple-50 transition-colors">
            <FileText className="w-5 h-5 text-purple-600" />
            <div className="text-left">
              <p className="font-semibold text-gray-900 text-sm">Blog</p>
              <p className="text-xs text-gray-500">Analyses et guides</p>
            </div>
          </Link>
          <Link href="/fr/about" className="flex items-center gap-3 bg-white border border-gray-200 rounded-xl px-4 py-3 hover:border-amber-300 hover:bg-amber-50 transition-colors">
            <Search className="w-5 h-5 text-amber-600" />
            <div className="text-left">
              <p className="font-semibold text-gray-900 text-sm">A Propos</p>
              <p className="text-xs text-gray-500">Comment fonctionne l&apos;IA</p>
            </div>
          </Link>
        </div>

        <Link href="/fr" className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-semibold transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Retour a l&apos;accueil
        </Link>
      </div>
    </div>
  );
}
