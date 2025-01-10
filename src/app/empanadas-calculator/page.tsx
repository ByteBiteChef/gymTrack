"use client";

import ActionButton from "@/components/ActionButton";
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
		<div className="flex flex-col h-screen w-screen bg-[#0a0a0a]  py-28 items-center overflow-scroll">
			<h1 className="text-white text-2xl mb-6">
				Calculadora de Empanadas
			</h1>
			<div className="border-orange-400 w-5/6 border-2 rounded-md p-4">
				<form
					onSubmit={handleSubmit}
					className="flex flex-col items-center space-y-4 bg-white p-4 rounded w-full "
				>
					<label htmlFor="docenas">Cantidad de docenas:</label>
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
						className="w-2/3 h-full rounded-sm p-2 text-center text-sm uppercase transition duration-500 bg-gradient-to-r from-[#FF512F] via-[#F09819] to-[#FF512F] bg-[length:200%] bg-left text-white font-bold shadow-[0_0_14px_-7px_#f09819] border-0 hover:bg-right active:scale-95"
					>
						Calcular
					</button>
				</form>

				{result && (
					<div className="mt-8 bg-white p-4 rounded w-full flex flex-col">
						<div className="w-full flex justify-end">
							<ActionButton
								className="rounded-sm w-8"
								text="X"
								handleAction={() => {
									setResult(null);
									setDocenas("");
								}}
							/>
						</div>

						<h2 className="text-lg mb-2 mt-4">
							Resultado para {docenas} docenas
						</h2>
						<p>Total de Empanadas: {result.totalDeEmpanadas}</p>

						<div className="mt-4 border-2 p-4 rounded">
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

						<div className="mt-4 border-2 p-4 rounded">
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
										Grasa Cocción:{" "}
										{result.relleno.grasaCoccion}
									</span>
									<input type="checkbox" />
								</li>
							</ul>
						</div>

						<div className="mt-4 border-2 p-4 rounded">
							<span className="font-semibold">Grasa Total:</span>{" "}
							{result.grasaTotal}
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default CalculateEmpanadasPage;
