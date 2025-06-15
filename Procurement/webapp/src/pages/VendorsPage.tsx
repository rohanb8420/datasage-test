import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface Vendor {
  vendorNumber: string;
  name: string;
  city: string;
  country: string;
  status: string;
  emails: string[];
  address: string[];
  postalCode: string;
  categories: string[];
  products: string[];
}

const VendorsPage: React.FC = () => {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [query, setQuery] = useState('');

  useEffect(() => {
    fetch('/data/vendors.json')
      .then(res => res.json())
      .then((data: Vendor[]) => setVendors(data))
      .catch(console.error);
  }, []);

  const filtered = vendors.filter(v => {
    const q = query.toLowerCase();
    if (!q) return true;
    return (
      v.vendorNumber.toLowerCase().includes(q) ||
      v.name.toLowerCase().includes(q) ||
      v.categories.some(c => c.toLowerCase().includes(q)) ||
      v.products.some(p => p.toLowerCase().includes(q))
    );
  });

  const navigate = useNavigate();
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Vendors</h1>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search vendors..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
        />
      </div>
      <div>
        <p className="mb-2 text-sm text-gray-600">{filtered.length} vendors found</p>
        <div className="overflow-auto">
          <table className="min-w-full table-auto border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-2 py-1 text-left text-sm font-semibold">Vendor #</th>
                <th className="px-2 py-1 text-left text-sm font-semibold">Name</th>
                <th className="px-2 py-1 text-left text-sm font-semibold">City</th>
                <th className="px-2 py-1 text-left text-sm font-semibold">Country</th>
                <th className="px-2 py-1 text-left text-sm font-semibold">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(v => (
                <tr key={v.vendorNumber} className="border-t">
                  <td className="px-2 py-1 text-sm">{v.vendorNumber}</td>
                  <td className="px-2 py-1 text-sm">{v.name}</td>
                  <td className="px-2 py-1 text-sm">{v.city}</td>
                  <td className="px-2 py-1 text-sm">{v.country}</td>
                  <td className="px-2 py-1 text-sm">
                    <button
                      onClick={() => navigate(`/erfq?vendor=${encodeURIComponent(v.vendorNumber)}`)}
                      className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                    >
                      Start RFQ
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default VendorsPage;