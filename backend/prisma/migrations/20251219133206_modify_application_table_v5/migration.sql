-- AddForeignKey
ALTER TABLE "applications" ADD CONSTRAINT "applications_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE SET NULL ON UPDATE CASCADE;
