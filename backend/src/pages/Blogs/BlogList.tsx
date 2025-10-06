import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import BasicTableOne from "../../components/tables/BasicTables/BasicTableOne";

export default function BlogList() {
  return (
    <>
      <PageMeta
        title="Blog | Money Now Wealth"
        description="Money Now Wealth"
      />
      <PageBreadcrumb pageTitle="Blog List" />
      <div className="space-y-6">
        {/* <ComponentCard title="Blog List"> */}
          <BasicTableOne />
        {/* </ComponentCard> */}
      </div>
    </>
  );
}
