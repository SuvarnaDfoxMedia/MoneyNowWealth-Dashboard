import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
<<<<<<< HEAD
import BasicTableOne from "../../components/tables/ListingComponents/TopicListing";
=======
import BasicTableOne from "../../components/tables/BasicTables/BlogListing";
>>>>>>> 9366e7e235c66c680354e16c22955b374b60a0c8

export default function BasicTables() {
  return (
    <>
      <PageMeta
        title="React.js Basic Tables Dashboard | TailAdmin - Next.js Admin Dashboard Template"
        description="This is React.js Basic Tables Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <PageBreadcrumb pageTitle="Basic Tables" />
<<<<<<< HEAD
      <div className="space-y-2">
=======
      <div className="space-y-6">
>>>>>>> 9366e7e235c66c680354e16c22955b374b60a0c8
        <ComponentCard title="Basic Table 1">
          <BasicTableOne />
        </ComponentCard>
      </div>
    </>
  );
}
