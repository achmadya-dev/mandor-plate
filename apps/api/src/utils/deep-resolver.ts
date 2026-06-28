type AnyRecord = Record<string, unknown>;

async function deepResolvePromises(input: unknown): Promise<unknown> {
  if (input instanceof Promise) {
    return await input;
  }

  if (Array.isArray(input)) {
    return Promise.all(input.map((item) => deepResolvePromises(item)));
  }

  if (input instanceof Date) {
    return input;
  }

  if (typeof input === 'object' && input !== null) {
    const source = input as AnyRecord;
    const resolvedObject: AnyRecord = {};

    for (const key of Object.keys(source)) {
      resolvedObject[key] = await deepResolvePromises(source[key]);
    }

    return resolvedObject;
  }

  return input;
}

export default deepResolvePromises;
