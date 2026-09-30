from repositories import brand_repo

def get_brands(conn):
    brands: dict[str, list] = {}
    for r in brand_repo.fetch_brand_skus(conn):
        brands.setdefault(r["brand"], []).append({"sku": r["sku"], "description": r["sku_description"]})
    return [{"brand": b, "skus": s} for b, s in brands.items()]
