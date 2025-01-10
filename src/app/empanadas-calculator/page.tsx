"use client";

import React, { useState } from "react";

function insumosTotales(docenasDeEmpas: number) {
	const empanadas = docenasDeEmpas * 12;
	const discosPorKgHarina = 42;

	// Insumos para la masa
	const harina = empanadas / discosPorKgHarina;
	const agua = harina * 0.45;
	const grasa = harina * 0.2;
	const sal = harina * 0.02;

	// Insumos para el relleno
	const carne = empanadas * 0.036;
	const huevos = docenasDeEmpas * 2.6;
	const verdeo = docenasDeEmpas / 2.5;
	const grasaCoccion = docenasDeEmpas * 0.024;

	const grasaTotal = grasa + grasaCoccion;

	return {
		totalDeEmpanadas: `${empanadas} unidades`,
		masa: {
			harina: `${harina.toFixed(2)} kg`,
			agua: `${agua.toFixed(2)} litros`,
			grasa: `${grasa.toFixed(2)} kg`,
			sal: `${sal.toFixed(2)} kg`,
		},
		relleno: {
			carne: `${carne.toFixed(2)} kg`,
			huevos: `${huevos.toFixed(2)} unidades`,
			verdeo: `${verdeo.toFixed(2)} kg`,
			grasaCoccion: `${grasaCoccion.toFixed(2)} kg`,
		},
		grasaTotal: `${grasaTotal.toFixed(2)} kg`,
	};
}

const CalculateEmpanadasPage = () => {
	const [docenas, setDocenas] = useState<string>("");
	const [result, setResult] = useState<ReturnType<
		typeof insumosTotales
	> | null>(null);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		const docenasNumber = parseFloat(docenas);
		if (isNaN(docenasNumber) || docenasNumber <= 0) {
			alert("Por favor ingresa un número válido de docenas.");
			return;
		}

		const output = insumosTotales(docenasNumber);
		setResult(output);
	};

	return (
		<div className="flex flex-col h-screen w-screen bg-[#0a0a0a]  pt-28 items-center ">
			<h1 className="text-white text-2xl mb-6">
				Calculadora de Empanadas
			</h1>

			<form
				onSubmit={handleSubmit}
				className="flex flex-col items-center space-y-4 bg-gray-800 p-4 rounded"
			>
				<label className="text-white" htmlFor="docenas">
					Cantidad de docenas:
				</label>
				<input
					id="docenas"
					type="number"
					className="p-2 border rounded text-black"
					placeholder="Ej.: 5"
					value={docenas}
					onChange={(e) => setDocenas(e.target.value)}
				/>

				<button
					type="submit"
					className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 transition-colors"
				>
					Calcular
				</button>
			</form>

			{result && (
				<div className="mt-8 text-white bg-gray-800 p-4 rounded w-80">
					<h2 className="text-xl font-bold mb-2">
						Resultado para {docenas} docenas
					</h2>
					<p>Total de Empanadas: {result.totalDeEmpanadas}</p>

					<div className="mt-4">
						<h3 className="font-semibold">Masa:</h3>
						<ul className="list-disc list-inside space-y-2 mt-2">
							<li className="flex items-center justify-between">
								<span>Harina: {result.masa.harina}</span>
								<input type="checkbox" />
							</li>
							<li className="flex items-center justify-between">
								<span>Agua: {result.masa.agua}</span>
								<input type="checkbox" />
							</li>
							<li className="flex items-center justify-between">
								<span>Grasa: {result.masa.grasa}</span>
								<input type="checkbox" />
							</li>
							<li className="flex items-center justify-between">
								<span>Sal: {result.masa.sal}</span>
								<input type="checkbox" />
							</li>
						</ul>
					</div>

					<div className="mt-4">
						<h3 className="font-semibold">Relleno:</h3>
						<ul className="list-disc list-inside space-y-2 mt-2">
							<li className="flex items-center justify-between">
								<span>Carne: {result.relleno.carne}</span>
								<input type="checkbox" />
							</li>
							<li className="flex items-center justify-between">
								<span>Huevos: {result.relleno.huevos}</span>
								<input type="checkbox" />
							</li>
							<li className="flex items-center justify-between">
								<span>Verdeo: {result.relleno.verdeo}</span>
								<input type="checkbox" />
							</li>
							<li className="flex items-center justify-between">
								<span>
									Grasa Cocción: {result.relleno.grasaCoccion}
								</span>
								<input type="checkbox" />
							</li>
						</ul>
					</div>

					<p className="mt-4">
						<span className="font-semibold">Grasa Total:</span>{" "}
						{result.grasaTotal}
					</p>
				</div>
			)}
		</div>
	);
};

export default CalculateEmpanadasPage;
