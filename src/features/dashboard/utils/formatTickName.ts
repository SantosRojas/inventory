// utils/formatName.ts

function formatTickName(name: string, isMobile: boolean,length: number = 15): string {
  if (isMobile) {
    return name.length > length-3 ? `${name.substring(0, length-6)}...` : name;
  }
  return name.length > length ? `${name.substring(0, length - 3)}...` : name;
}

export default formatTickName;