/**
 * Assign the project to an employee.
 * @param {Object} arguments
 * @param {import('@actions/github/lib/utils').GitHub} arguments.github
 * @param {import('@actions/github/lib/context').Context} arguments.context
 * @param {typeof import('@actions/core')} arguments.core
 */
module.exports = ({github, context, core}) => {
	/**
	 * @param inputs {{
	 *     TENANTS: string,
	 *     BRANDS: string,
	 *     BRANDS_EXCLUDE: string,
	 *     PLATFORM: string
	 * }}
	 * */
	const inputs = process.env;

	const filterBrandsByPlatform = brand => brand[0] === inputs.PLATFORM[0];
	const mapBrandToBrandName = brand => brand.split("-")[1];

	/**
	 * #1 Set tenants
	 * */
	const tenantGroups = require("../tenants.json");
	const tenants = tenantGroups[inputs.TENANTS];

	core.summary
		.addHeading('Tenants')
		.addCodeBlock(JSON.stringify(tenants, null, 4), 'json');

	// 2 Check if brand is defined or tenants defined
	const brandNamesByPlatform = inputs.BRANDS
		? inputs.BRANDS.split(" ").filter(filterBrandsByPlatform).map(mapBrandToBrandName)
		: tenants;

	core.summary
		.addHeading('Included Brands')
		.addCodeBlock(JSON.stringify(brandNamesByPlatform, null, 4), 'json');

	// 3 Remove excluded brands
	const excludedBrandNamesByPlatform = inputs.BRANDS_EXCLUDE
		? inputs.BRANDS_EXCLUDE.split(" ").filter(filterBrandsByPlatform).map(mapBrandToBrandName)
		: [];

	core.summary
		.addHeading('Excluded Brands')
		.addCodeBlock(JSON.stringify(excludedBrandNamesByPlatform, null, 4), 'json');

	const parsedBrands = brandNamesByPlatform.filter(brand => !excludedBrandNamesByPlatform.includes(brand));

	core.summary
		.addHeading('Parsed Brands')
		.addCodeBlock(JSON.stringify(parsedBrands, null, 4), 'json');

	core.setOutput("parsedBrands", parsedBrands.join(" "));
};
