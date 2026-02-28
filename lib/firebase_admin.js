import admin from "firebase-admin";

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: "new-reality-84a92",
      clientEmail: "firebase-adminsdk-fbsvc@new-reality-84a92.iam.gserviceaccount.com",
      privateKey:  "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDFwKp9j9S+sZFH\nKkqZ0KVPjn8ILozw20wg4BkKEXObokNsr6OYpus+IL72PxL8Oy77aSRQ8YCQ0V/i\nhVK3pR7OLXu7gRa4t62Zg3YEdLaD+vsBKYO0ITWv7S0B3MgtJg0d9vrIl7maDTDN\nmscpqfu7Bn6dU7DECBQuDhI8kwBfZFhhYCND94adEkVFmwFaSp9tuTomIwfr7IsB\nGd/X1wqQBCMzSZLR5674y+CLYSR3RNo+5pw6svqquzoSx8djIIbiKBiQaHgn2NyD\nzcegiOSb5p2emR5C87RoQJwolNLtRQ9lXN2AMi7p9Z+RVPHz6GCxK3/O45/hP4C/\nM/fQ0ud3AgMBAAECggEADOboQ19DdkTtNr3ry8Og+CL9ZxdrwE571eHucEmO3TbF\n0besjknxq4Yvv1mCemy9a3oYJvnNYBAbrT1H63hn8p66uxM4hskLwqog5I3dge3k\nO4FYY5kOa3x8xRQrsUURclo0ptVorsQxN3DjkUnTBTLuxtf40/QM+6uVBVkNRgE6\nAse+GTOGUkrD2jwJD4yhZs2PBpRh4xu+OeyO9GkRk1jqEXPQnCebJqhof7VnE9Im\nvak3nUwO06663IKrGmBfC5Aq1qiqNINBxU3GVitU6rwZVMONUqxvc++5tT/XF+Et\nTALdEVu/z4571XMb2i+I2WC3C8Sd0kiUXc0gIqIq1QKBgQD37NWudyCncg4NkiD+\nduGbFUAjwVDjf0fAI98b5usszQBZktc527A5MTC4vEoQV49+HQ9Szg6JPRcG3kAN\nu/bqLEDRJnmSRqij7usjngmKuBvntbW1+2LukOsyiJrzR6Hi6WADFwxRSJjV/zvL\ntyKIrglR4UFzZallOGc6/dWzNQKBgQDMMX/qimJ9jHtc6UH+cVqSKjb60yOt2YWh\nGpc0Pd/nHeFTo2Mql93LXCnR0RJhrICR0W+sQtydbehNEz/4+WhKzOvVx0Mx7PSS\neY0izPt6sgICASSpdLuko+Ir6LT4magsJM4tv5VL00HxD1KZCwbIPcsrwQJ2JoZp\niT63biM5ewKBgQCapfDkUwrbaBm7/Vr3X9B6nFbV9tAuGEb5Y2bYUMKBv55oQWBf\nhtn10ulBUrIgX33yfM4CKOaIVML4Vco+xvDOQaxsykMrK0gmefHS1dG95foCHyap\nzZV4mo0biHqfJh+lG034n3fffBlZ40u5VxMDjwvhN1FMWi3AJd6+vXd/wQKBgBoE\n6LbbQWecIhAZzQX+LbtYU78sbmx1vlhkCgZnKAPMQ+0jcbx4s5N5P/7zdDMsBwoN\ntPwvXOtWmPZRUKKKLWbyq86G4KIY/qU3het8UUM2MZlNyf0p2ctF8skDkyPmeI5/\ndiJQOlb6KXntKOpFhGy5qwz9QDIMAK6sBWjcSPLHAoGAcQbTjTMNlAbclt9PXL8C\nN2YQHr2VyDDnSHlCy/7Nv93+h6he1pjsc1kP2WgfnbyLEGvdIPzwqx8swGIVjm0g\nB5cEokZCRLRdxTuxOBAj6FF9mwVZtEi1xZIlmD3DtlQVBhgRtOYqfmpLf3TCRz8/\nC/WHbiGEYccwPpMxQKgsWPc=\n-----END PRIVATE KEY-----\n",
    }),
  });
}

export const db = admin.firestore();