"use client";

import { useState } from "react";

export default function PropertyImporter() {
  const [imported, setImported] = useState(false);
  return (
    <div className="rounded border p-4 space-y-3">
      <div className="text-xs uppercase tracking-wide text-gray-500">Beta</div>
      <h3 className="text-lg font-medium">Property Importer (Mock)</h3>
      <p className="text-sm text-gray-600">Simulate importing data from listings portals to prefill your simulation.</p>
      <button className="px-3 py-2 rounded bg-gray-200" onClick={() => setImported(true)}>Mock Import</button>
      {imported && <p className="text-green-700 text-sm">Imported example property: 2BR, 85m², $450,000</p>}
    </div>
  );
}
