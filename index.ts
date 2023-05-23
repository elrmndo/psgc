import xlsx from "xlsx";

type RawGeographicLevel =
  | "Bgy"
  | "City"
  | "Dist"
  | "Mun"
  | "Prov"
  | "Reg"
  | "SGU"
  | "SubMun";
type CityClass = "CC" | "HUC" | "ICC";
type RawUrbanRural = "R" | "U";
type RawStatus = "Capital" | "Pob.";

type RawItem = {
  code: string;
  name: string;
  correspondenceCode: string;
  geographicLevel: RawGeographicLevel;
  oldName?: string;
  cityClass?: CityClass;
  incomeClassification?: string;
  urbanOrRural?: RawUrbanRural;
  population2015: number;
  population2020: number;
  status?: RawStatus;
};

// ! Code Structure
// ! 01 028 05 003
// ! 01 - Region Code
// ! 028 - Province Code / HUC
// ! 05 - Municipal / City Code
// ! 003 - Barangay Code

// TODO: Create mock response for districts
// TODO: Create mock response for special geographic areas
// TODO: Create mock response for cities
// TODO: Create mock response for barangays

const workbook = xlsx.readFile("./psgc_data.xlsx");
const sheets = workbook.SheetNames;
const rawData: RawItem[] = xlsx.utils.sheet_to_json(workbook.Sheets[sheets[3]]);

type Population = {
  year: string;
  value: number;
};

type MetaData = {
  code: string;
  correspondenceCode: string;
  population?: Population[];
};

type BaseData = {
  name: string;
  oldName?: string;
  incomeClassification?: string;
  metaData?: MetaData;
};

type Region = BaseData & { regionCode: string };

type Province = BaseData & { regionCode: string; provinceCode: string };

type City = BaseData & {
  regionCode: string;
  provinceCode: string;
  cityCode: string;
  cityClass: CityClass;
  isCapital: boolean;
};

type Barangay = BaseData & {
  regionCode: string;
  provinceCode: string;
  cityCode: string;
  barangayCode: string;
  isUrban: boolean;
  isPoblacion: boolean;
};

const data = rawData.reduce((accumulator: Region[], currentValue: RawItem) => {
  if (currentValue.geographicLevel === "Reg") {
    accumulator.push({
      regionCode: "0", // TODO: Get this
      name: currentValue.name,
      oldName: currentValue.oldName,
      metaData: {
        code:
          typeof currentValue.code === "number"
            ? `${currentValue.code}`
            : currentValue.code,
        correspondenceCode:
          typeof currentValue.correspondenceCode === "number"
            ? `${currentValue.correspondenceCode}`
            : currentValue.correspondenceCode,
      },
    });
  }

  return accumulator;
}, []);
