function allocate(amount, ratios) {
	const total = ratios.salary + ratios.emergency + ratios.future;
	if (total !== 100) throw new Error("Ratios must sum to 100");
	
	const salary = Math.round((amount * ratios.salary) / 100);
	const emergency = Math.round((amount * ratios.emergency) / 100);
	const future = Math.round((amount * ratios.future) / 100);
	
	// Handle rounding differences by adding remainder to salary jar
	const diff = amount - (salary + emergency + future);
	return { 
		salary: salary + diff, 
		emergency, 
		future 
	};
}

module.exports = { allocate };
