import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 30,
  duration: '20s',
};

const FRONTEND_URL = __ENV.FRONTEND_URL || 'http://localhost:30080';

export default function () {
  const res = http.get(`${FRONTEND_URL}/`);

  check(res, {
    'status is 200': (r) => r.status === 200,
    'loaded PersonalInfo section': (r) =>
      r.body.includes('Personal') || r.body.includes('First Name'),
    'response time < 500ms': (r) => r.timings.duration < 500,
  });

  sleep(1);
}