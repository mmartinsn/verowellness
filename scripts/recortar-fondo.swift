import Foundation
import Vision
import CoreImage
import ImageIO
import UniformTypeIdentifiers

let args = CommandLine.arguments
let inURL = URL(fileURLWithPath: args[1]), outURL = URL(fileURLWithPath: args[2])
guard let src = CGImageSourceCreateWithURL(inURL as CFURL, nil),
      let cg = CGImageSourceCreateImageAtIndex(src, 0, nil) else { print("no se pudo leer"); exit(1) }
let req = VNGenerateForegroundInstanceMaskRequest()
let handler = VNImageRequestHandler(cgImage: cg, options: [:])
try handler.perform([req])
guard let obs = req.results?.first else { print("sin persona detectada"); exit(2) }
let maskBuf = try obs.generateScaledMaskForImage(forInstances: obs.allInstances, from: handler)
let ci = CIImage(cgImage: cg)
let mask = CIImage(cvPixelBuffer: maskBuf)
let out = ci.applyingFilter("CIBlendWithMask", parameters: [kCIInputBackgroundImageKey: CIImage.empty(), kCIInputMaskImageKey: mask])
let ctx = CIContext()
guard let outCG = ctx.createCGImage(out, from: ci.extent),
      let dest = CGImageDestinationCreateWithURL(outURL as CFURL, UTType.png.identifier as CFString, 1, nil) else { print("no se pudo escribir"); exit(3) }
CGImageDestinationAddImage(dest, outCG, nil)
CGImageDestinationFinalize(dest)
print("ok \(outCG.width)x\(outCG.height) instancias: \(obs.allInstances.count)")
