"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { extractUrlFromText } from "./extractUrlFromText";
import { URLInput } from "./URLInput";
import { useSearchFormData } from "./useSearchFormData";

export const SearchForm = () => {
	const router = useRouter();
	const [url, setUrl] = useState("");
	const [urlParseError, setUrlParseError] = useState<string | null>(null);
	const { formData, updateFormData } = useSearchFormData();

	const handleUrlParsingAndNavigation = (e: React.FormEvent) => {
		e.preventDefault();

		if (!url.trim()) {
			setUrlParseError(
				"Please enter text containing a DB booking URL or paste a direct DB booking link"
			);
			return;
		}

		const extractedUrl = extractUrlFromText(url);

		if (!extractedUrl) {
			setUrlParseError(
				"No valid DB booking URL found. Please paste text containing a Deutsche Bahn booking link (from bahn.de with /buchung/start path) or check that your URL is correct."
			);
			return;
		}

		const searchParams = new URLSearchParams({
			url: extractedUrl,
			bahnCard: formData.bahnCard,
			hasDeutschlandTicket: String(formData.hasDeutschlandTicket),
			passengerAge: String(formData.passengerAge),
			travelClass: formData.travelClass,
			// autoSearch: "true", // Flag to indicate auto-search should happen
		});

		router.push(`/discount?${searchParams.toString()}`);
	};

	// Generate the target URL for the link (when form is valid)
	const getTargetUrl = () => {
		if (!url.trim()) return null;

		const extractedUrl = extractUrlFromText(url);
		if (!extractedUrl) return null;

		const searchParams = new URLSearchParams({
			url: extractedUrl,
			bahnCard: formData.bahnCard,
			hasDeutschlandTicket: String(formData.hasDeutschlandTicket),
			passengerAge: String(formData.passengerAge),
			travelClass: formData.travelClass,
		});

		return `/discount?${searchParams.toString()}`;
	};

	const targetUrl = getTargetUrl();

	return (
		<section>
			{/* Unified Input and Search Section */}
			<form onSubmit={handleUrlParsingAndNavigation}>
				<div className="space-y-6">
					<URLInput url={url} setUrl={setUrl} />
					<fieldset className="border-0 p-0 m-0">
						<legend className="sr-only">Reiseeinstellungen</legend>
						<div className="flex flex-col md:flex-row gap-8">
						<div className="w-full">
							<label htmlFor="bahncard-select" className="block text-sm font-medium text-muted-foreground mb-1">
								BahnCard
							</label>
							<select
								id="bahncard-select"
								value={formData.bahnCard}
								onChange={(e) => updateFormData({ bahnCard: e.target.value })}
								className="w-full px-3 py-2 resize-vertical border-b-2 border-border bg-input focus:ring-2 focus:ring-primary"
								aria-describedby="bahncard-help"
							>
								<option value="none">Keine BahnCard</option>
								<option value="25">BahnCard 25</option>
								<option value="50">BahnCard 50</option>
							</select>
							<span id="bahncard-help" className="sr-only">Wählen Sie Ihren BahnCard-Typ aus</span>
						</div>
						<div className="w-full">
							<label htmlFor="passenger-age" className="block text-sm font-medium text-muted-foreground mb-1">
								Alter des Reisenden
							</label>
							<input
								id="passenger-age"
								type="number"
								value={formData.passengerAge}
								onChange={(e) => updateFormData({ passengerAge: e.target.value })}
								placeholder="Alter des Reisenden"
								min="0"
								max="120"
								className="w-full px-3 py-2 resize-vertical border-b-2 border-border bg-input focus:ring-2 focus:ring-primary"
								aria-describedby="age-help"
							/>
							<span id="age-help" className="sr-only">Geben Sie das Alter des Reisenden ein</span>
						</div>
						<div className="w-full">
							<label htmlFor="deutschlandticket-select" className="block text-sm font-medium text-muted-foreground mb-1">
								Deutschlandticket
							</label>
							<select
								id="deutschlandticket-select"
								value={String(formData.hasDeutschlandTicket)}
								onChange={(e) =>
									updateFormData({
										hasDeutschlandTicket: e.target.value === "true",
									})
								}
								className="w-full px-3 py-2 resize-vertical border-b-2 border-border bg-input focus:ring-2 focus:ring-primary"
								aria-describedby="deutschlandticket-help"
							>
								<option value="true">Deutschlandticket</option>
								<option value="false">Kein Deutschlandticket</option>
							</select>
							<span id="deutschlandticket-help" className="sr-only">Geben Sie an, ob Sie ein Deutschlandticket besitzen</span>
						</div>
						<div className="w-full">
							<label htmlFor="travel-class-select" className="block text-sm font-medium text-muted-foreground mb-1">
								Reiseklasse
							</label>
							<select
								id="travel-class-select"
								value={String(formData.travelClass)}
								onChange={(e) =>
									updateFormData({
										travelClass: e.target.value,
									})
								}
								className="w-full px-3 py-2 resize-vertical border-b-2 border-border bg-input focus:ring-2 focus:ring-primary"
								aria-describedby="travel-class-help"
							>
								<option value="1">Erste Klasse</option>
								<option value="2">Zweite Klasse</option>
							</select>
							<span id="travel-class-help" className="sr-only">Wählen Sie Ihre bevorzugte Reiseklasse</span>
						</div>
					</div>
					</fieldset>

					{targetUrl ? (
						<a
							href={targetUrl}
							onClick={(e) => {
								e.preventDefault();
								handleUrlParsingAndNavigation(e);
							}}
							role="button"
							aria-describedby="form-description"
							className="w-full bg-primary text-white py-3 px-4 rounded-full hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors text-lg font-semibold inline-block text-center no-underline"
						>
							Bessere Verbindung suchen
						</a>
					) : (
						<button
							type="submit"
							disabled={!url.trim()}
							aria-describedby="form-description"
							aria-disabled={!url.trim()}
							className="w-full bg-primary text-white py-3 px-4 rounded-full hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:bg-primary-disabled disabled:text-primary-disabled-text disabled:cursor-not-allowed transition-colors text-lg font-semibold"
						>
							Bessere Verbindung suchen
						</button>
					)}
					<span id="form-description" className="sr-only">
						Sucht nach günstigeren Split-Ticket Optionen für Ihre DB-Verbindung
					</span>
				</div>

				{urlParseError && (
					<div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
						<strong>Error:</strong> {urlParseError}
					</div>
				)}
			</form>
		</section>
	);
};
