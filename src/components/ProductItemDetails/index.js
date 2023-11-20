import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'
import {Link} from 'react-router-dom'
import './index.css'
import Header from '../Header'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}
class ProductItemDetails extends Component {
  state = {
    apiStatus: apiStatusConstants.initial,
    productDetails: '',
    similarProductsList: '',
  }

  componentDidMount() {
    this.getProductDetails()
  }

  renderLoadingViewForProductDetails = () => (
    <div className="products-loader-container">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  renderFailureView = () => (
    <div>
      <img
        alt="failure view"
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
      />
      <h1>Product Not Found</h1>
      <Link to="/products">
        <button type="button">Continue Shopping</button>
      </Link>
    </div>
  )

  renderSuccess = () => {
    const {productDetails, similarProductsList} = this.state
    console.log('bheem')
    console.log(productDetails)
    console.log(similarProductsList)
    return (
      <div>
        <h1>bheem</h1>
      </div>
    )
  }

  getProductDetails = async () => {
    const {match} = this.props
    const {params} = match
    const {id} = params
    console.log(id)
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const jwtToken = Cookies.get('jwt_token')
    const apiUrl = `http://localhost:3000/products/${id}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    console.log(response)

    if (response.ok === true) {
      console.log('anagani')
      const data = await response.json()

      const updatedData = data.map(item => ({
        id: item.id,
        imageUrl: item.image_url,
        title: item.title,
        brand: item.brand,
        totalReviews: item.total_reviews,
        rating: item.rating,
        availability: item.availability,
        similarProducts: item.similar_products,
      }))
      const updateSimilarProducts = updatedData.similarProducts.map(item => ({
        id: item.id,
        imageUrl: item.image_url,
        title: item.title,
        style: item.style,
        price: item.price,
        description: item.description,
        brand: item.brand,
        totalReviews: item.total_reviews,
        rating: item.rating,
        availability: item.availability,
      }))
      this.setState({
        productDetails: updatedData,
        similarProductsList: updateSimilarProducts,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderAll = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderSuccess()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingViewForProductDetails()
      default:
        return null
    }
  }

  render() {
    return (
      <div>
        <Header />
        {this.renderAll()}
      </div>
    )
  }
}

export default ProductItemDetails
