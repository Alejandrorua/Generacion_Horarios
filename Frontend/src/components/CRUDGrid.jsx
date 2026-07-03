import { useState } from 'react';

export default function CRUDGrid({ title, subtitle, data, columns, onAdd, onEdit, onDelete, searchPlaceholder }) {
  const [searchTerm, setSearchTerm] = useState('');

  // Filtrado genérico por cualquier columna de texto
  const filteredData = data.filter(item => 
    columns.some(col => 
      String(item[col.key]).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">{title}</h2>
          <p className="text-sm text-slate-500">{subtitle}</p>
        </div>
        {onAdd && (
          <button onClick={onAdd} className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2.5 rounded-xl transition-all shadow-md shadow-blue-600/10 whitespace-nowrap">
            + Registrar Nuevo
          </button>
        )}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        {/* Buscador Integrado */}
        <div className="p-4 bg-slate-50/50 border-b border-slate-100">
          <input
            type="text"
            placeholder={searchPlaceholder || "Buscar registros..."}
            className="w-full md:w-80 border border-slate-200 rounded-xl p-2.5 text-sm outline-none focus:border-blue-500 bg-white transition-all shadow-inner"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Tabla Responsiva */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-100 text-slate-600 text-xs uppercase font-semibold">
                {columns.map(col => (
                  <th key={col.key} className="p-4">{col.label}</th>
                ))}
                {(onEdit || onDelete) && <th className="p-4 text-center">Acciones</th>}
              </tr>
            </thead>
            <tbody className="text-slate-700 text-sm divide-y divide-slate-50">
              {filteredData.length > 0 ? (
                filteredData.map((item, index) => (
                  <tr key={index} className="hover:bg-slate-50/50 transition-colors">
                    {columns.map(col => (
                      <td key={col.key} className="p-4">
                        {col.render ? col.render(item) : item[col.key]}
                      </td>
                    ))}
                    {(onEdit || onDelete) && (
                      <td className="p-4 text-center">
                        <div className="flex justify-center gap-2">
                          {onEdit && (
                            <button onClick={() => onEdit(item)} className="p-1.5 text-blue-600 hover:bg-blue-5,0 rounded-lg transition-colors" title="Editar">
                              ✏️
                            </button>
                          )}
                          {onDelete && (
                            <button onClick={() => onDelete(item)} className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors" title="Eliminar">
                              🗑️
                            </button>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={columns.length + 1} className="p-8 text-center text-slate-400 italic">
                    No se encontraron registros coincidentes.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}