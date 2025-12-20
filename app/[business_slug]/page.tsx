import ProductGrid from "@/components/ProductGrid";

const BusinessDashboardPage = async ({
  params,
  searchParams,
}: {
  params: Promise<{ business_slug: string }>;
  searchParams: Promise<{ categoryId?: string }>;
}) => {
  const unwrappedParams = await params;
  const { categoryId } = await searchParams;
  const business_slug = unwrappedParams.business_slug;

  return (
    <div>
      <ProductGrid business_slug={business_slug} categoryId={categoryId} />
    </div>
  );
};

export default BusinessDashboardPage;
