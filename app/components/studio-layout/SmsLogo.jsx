import { Heading } from '~/components/catalyst-theme/heading'
import LogoIcon from '~/components/studio-layout/LogoIcon'
function Logo() {
  return (
    <div className="flex items-center flex-row gap-2">
      <LogoIcon className="h-4 w-4"/>
      <Heading className="text-sm">
         Song Maker Studio
      </Heading>
    </div>
  )
}

export default Logo;

