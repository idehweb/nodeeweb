import dayjs from 'dayjs';
import jalaliPlugin from '@zoomit/dayjs-jalali-plugin';

dayjs.extend(jalaliPlugin);

export const fDateTime = (d, f = 'YYYY/MM/DD HH:mm') => {
  return dayjs(d).calendar('jalali').format(f);
};
