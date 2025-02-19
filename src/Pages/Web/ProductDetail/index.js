import BreadcrumbComponent from "Components/Web/Breadcrumb"
import ProductDetail from "Components/Web/Product/ProductDetail"
import ProductViewImage from "Components/Web/Product/ProductDetail/ProductViewImage"
import SelectBlock from "Components/Web/Product/ProductShow/SelectBlock"
import ProductTab from "Components/Web/Product/ProductTab"
import { RENDER_LAPTOP_DETAIL_DEFAULT, TYPE_PRODUCT } from "Constants/Data"
import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useHistory, useParams } from "react-router"
import {
    getProductDetailApi,
    getProductsFilterApi
} from "Redux/Product/Product.thunk"
import { isEmpty } from "Utils/CheckType"
import { getRandomInteger } from "Utils/func"

// const ProductDetail = React.lazy(() =>
//     import("../../../Components/Web/Product/ProductDetail")
// )

const ProductDetailPage = () => {
    const { productType, productId } = useParams()
    const history = useHistory()
    const dispatch = useDispatch()

    const productsFilter = useSelector(
        state => state.ProductReducer.productsFilter
    )

    const productDetail = useSelector(
        state => state.ProductReducer.productDetail
    )

    // if (is404) {
    //     history.push("/not-found")
    // }

    // const [products, setProducts] = useState(
    //     getLS("productList")
    //         .sort((a, b) => b - a)
    //         .slice(0, 5)
    // )

    useEffect(() => {
        dispatch(
            getProductsFilterApi(
                productType,
                productType === TYPE_PRODUCT.LAPTOP
                    ? {
                          laptop_rams: [],
                          laptop_screens: [],
                          laptop_cpus: [],
                          laptop_brands: [getRandomInteger(1, 7)],
                          price: [],
                          page: 1
                      }
                    : {
                          drive_types: [],
                          drive_capacities: [],
                          brand_drive: [getRandomInteger(8, 12)],
                          price: [],
                          page: 1
                      }
            )
        )
    }, [productId])

    useEffect(() => {
        window.scrollTo(0, 0)
        if (
            !isNaN(productId) &&
            Object.values(TYPE_PRODUCT).includes(productType)
        ) {
            dispatch(getProductDetailApi(productType, productId)).then(res => {
                if (!res.success) {
                    history.push("/etech/not-found")
                }
            })
        } else {
            history.push("/etech/not-found")
        }
    }, [productId])

    return (
        <div>
            <BreadcrumbComponent
                pageName={
                    productType === TYPE_PRODUCT.LAPTOP
                        ? "Chi tiết Laptop"
                        : "Chi tiết Ổ Cứng"
                }
            />
            <div className="section">
                <div className="container">
                    <div className="row">
                        <div className="product product-details clearfix">
                            <ProductViewImage
                                images={
                                    (productDetail && productDetail.images) ||
                                    RENDER_LAPTOP_DETAIL_DEFAULT.images
                                }
                            />
                            <ProductDetail
                                detail={
                                    (productDetail && productDetail.info) ||
                                    RENDER_LAPTOP_DETAIL_DEFAULT.info
                                }
                                images={
                                    (productDetail && productDetail.images) ||
                                    RENDER_LAPTOP_DETAIL_DEFAULT.images
                                }
                                id={(productDetail && productDetail.id) || 0}
                            />
                            <ProductTab
                                description={
                                    (productDetail &&
                                        productDetail.description) ||
                                    RENDER_LAPTOP_DETAIL_DEFAULT.description
                                }
                            />
                        </div>
                    </div>
                </div>
            </div>
            {
                <SelectBlock
                    key={0}
                    selectBlockTitle={"Sản phẩm gợi ý"}
                    products={isEmpty(productsFilter) ? null : productsFilter}
                />
            }
        </div>
    )
}
export default ProductDetailPage
