class TokenService {
  private accessToken: string = ""
  
  public getAccessToken() {
    return this.accessToken
  }

  public setAccessToken(newToken = "") {
    this.accessToken = newToken
  }

  public removeAccessToken() {
    this.accessToken = ""
  }
}

export const tokenService = new TokenService()