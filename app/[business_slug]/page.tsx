import LogoutButton from "@/components/LogoutButton";
import ProductGrid from "@/components/PorductGrid";

const BusinessDashboardPage = async ({
  params,
}: {
  params: Promise<{ business_slug: string }>;
  searchParams: Promise<{ category?: string }>;
}) => {
  const unwrappedParams = await params;

  const business_slug = unwrappedParams.business_slug;

  return (
    <div>
      <ProductGrid business_slug={business_slug} />
      <LogoutButton />
    </div>
  );
};

export default BusinessDashboardPage;
